"""Generate the release-only offline American-English word audio inventory."""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import tempfile
from hashlib import sha256
from pathlib import Path
from typing import Callable, Mapping, NamedTuple

import numpy as np
import soundfile as sf
import espeakng_loader
import spacy
from huggingface_hub import hf_hub_download
from kokoro import KModel, KPipeline
from phonemizer.backend.espeak.wrapper import EspeakWrapper


MODULE_DIRECTORY = Path(__file__).resolve().parent
PROJECT_ROOT = MODULE_DIRECTORY.parent.parent
DEFAULT_MANIFEST = MODULE_DIRECTORY / "word-audio-manifest.json"
DEFAULT_AUDIO_DIRECTORY = PROJECT_ROOT / "web" / "public" / "audio" / "words"
DEFAULT_CACHE_DIRECTORY = MODULE_DIRECTORY / "cache" / "huggingface"
MODEL_REPOSITORY = "hexgrad/Kokoro-82M"
MODEL_REVISION = "f3ff3571791e39611d31c381e3a41a3af07b4987"
DEFAULT_MODEL_DIRECTORY = MODULE_DIRECTORY / "cache" / "model" / MODEL_REVISION
MODEL_ASSET_SHA256 = {
    "config.json": "5abb01e2403b072bf03d04fde160443e209d7a0dad49a423be15196b9b43c17f",
    "kokoro-v1_0.pth": "496dba118d1a58f5f3db2efc88dbdc216e0483fc89fe6e47ee1f2c53f18ad1e4",
    "voices/af_heart.pt": "0ab5709b8ffab19bfd849cd11d98f75b60af7733253ad0d67b12382a102cb4ff",
}
TEMP_DIRECTORY = MODULE_DIRECTORY / "output"
ESPEAK_RUNTIME_ROOT = Path(tempfile.gettempdir()) / "szu-degree-english-espeakng-loader-0.2.4"
SPACY_ENGLISH_MODEL = "en_core_web_sm"
SPACY_ENGLISH_MODEL_VERSION = "3.8.0"


class ModelAssets(NamedTuple):
    config_path: Path
    model_path: Path
    voice_path: Path


def require_english_spacy_model(
    is_package: Callable[[str], bool] = spacy.util.is_package,
) -> None:
    if not is_package(SPACY_ENGLISH_MODEL):
        raise RuntimeError(
            "缺少固定英语分词模型 en_core_web_sm==3.8.0；"
            "请先按 tools/audio/README.md 安装依赖。"
        )


def prepare_espeak_data_path(source_directory: Path, runtime_root: Path = ESPEAK_RUNTIME_ROOT) -> Path:
    source_phontab = source_directory / "phontab"
    if not source_phontab.is_file():
        raise RuntimeError(f"eSpeak NG 数据不完整：{source_phontab}")

    target_directory = runtime_root / "espeak-ng-data"
    completion_marker = target_directory / ".copy-complete"
    if completion_marker.is_file() and (target_directory / "phontab").is_file():
        return target_directory

    if target_directory.exists():
        shutil.rmtree(target_directory)
    runtime_root.mkdir(parents=True, exist_ok=True)
    shutil.copytree(source_directory, target_directory)
    completion_marker.write_text("espeakng-loader==0.2.4", encoding="ascii")
    return target_directory


def prepare_model_assets(
    model_directory: Path = DEFAULT_MODEL_DIRECTORY,
    downloader: Callable[..., str] = hf_hub_download,
    expected_hashes: Mapping[str, str] | None = MODEL_ASSET_SHA256,
) -> ModelAssets:
    filenames = ("config.json", "kokoro-v1_0.pth", "voices/af_heart.pt")
    model_directory.mkdir(parents=True, exist_ok=True)

    for filename in filenames:
        local_path = model_directory / filename
        if not local_path.exists():
            downloader(
                repo_id=MODEL_REPOSITORY,
                filename=filename,
                revision=MODEL_REVISION,
                local_dir=str(model_directory),
            )
        if not local_path.is_file():
            raise RuntimeError(f"模型资产下载后仍不存在：{filename}")
        if local_path.stat().st_size == 0:
            raise RuntimeError(f"模型资产为空：{filename}")
        if expected_hashes is not None:
            digest = sha256()
            with local_path.open("rb") as asset_file:
                for chunk in iter(lambda: asset_file.read(1024 * 1024), b""):
                    digest.update(chunk)
            if digest.hexdigest() != expected_hashes[filename]:
                raise RuntimeError(f"模型资产哈希不匹配：{filename}")

    return ModelAssets(
        config_path=model_directory / filenames[0],
        model_path=model_directory / filenames[1],
        voice_path=model_directory / filenames[2],
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="生成 1,911 个统一美式单词 MP3。")
    parser.add_argument("--manifest", type=Path, default=DEFAULT_MANIFEST)
    parser.add_argument("--audio-directory", type=Path, default=DEFAULT_AUDIO_DIRECTORY)
    parser.add_argument("--overwrite", action="store_true", help="覆盖已有 MP3。")
    return parser.parse_args()


def waveform_to_numpy(audio: object) -> np.ndarray:
    if hasattr(audio, "detach"):
        audio = audio.detach()
    if hasattr(audio, "cpu"):
        audio = audio.cpu()
    if hasattr(audio, "numpy"):
        audio = audio.numpy()
    return np.asarray(audio, dtype=np.float32)


def generate() -> None:
    args = parse_args()
    manifest_path = args.manifest.resolve()
    audio_directory = args.audio_directory.resolve()
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    if not isinstance(manifest, list) or not manifest:
        raise RuntimeError("音频清单为空或格式无效。")

    audio_directory.mkdir(parents=True, exist_ok=True)
    TEMP_DIRECTORY.mkdir(parents=True, exist_ok=True)
    existing = [audio_directory / entry["fileName"] for entry in manifest if (audio_directory / entry["fileName"]).exists()]
    if existing and not args.overwrite:
        raise RuntimeError(f"目标目录已有音频（例如 {existing[0].name}）；如需重建请使用 --overwrite。")

    os.environ.setdefault("HF_HOME", str(DEFAULT_CACHE_DIRECTORY))
    espeak_data_path = prepare_espeak_data_path(Path(espeakng_loader.get_data_path()))
    EspeakWrapper.set_data_path(str(espeak_data_path))
    require_english_spacy_model()
    assets = prepare_model_assets()
    model = KModel(
        repo_id=MODEL_REPOSITORY,
        config=str(assets.config_path),
        model=str(assets.model_path),
    )
    pipeline = KPipeline(lang_code="a", repo_id=MODEL_REPOSITORY, model=model)
    total = len(manifest)

    for completed, entry in enumerate(manifest, start=1):
        file_name = entry["fileName"]
        word = entry["word"]
        output_path = audio_directory / file_name
        chunks = [
            waveform_to_numpy(segment.audio)
            for segment in pipeline(word, voice=str(assets.voice_path), speed=1.0)
        ]
        if not chunks:
            raise RuntimeError(f"模型未为 {word!r} 生成音频。")
        waveform = np.concatenate(chunks)

        temporary_path: Path | None = None
        encoded_successfully = False
        try:
            with tempfile.NamedTemporaryFile(dir=TEMP_DIRECTORY, suffix=".wav", delete=False) as temporary_file:
                temporary_path = Path(temporary_file.name)
            sf.write(temporary_path, waveform, 24_000)
            subprocess.run(
                [
                    "ffmpeg", "-y", "-v", "error", "-i", str(temporary_path),
                    "-ac", "1", "-ar", "24000", "-b:a", "48k", str(output_path),
                ],
                check=True,
            )
            encoded_successfully = True
        finally:
            if temporary_path is not None and temporary_path.exists() and encoded_successfully:
                temporary_path.unlink()

        if completed % 25 == 0 or completed == total:
            print(f"已生成 {completed}/{total}", flush=True)

    subprocess.run(
        ["node", str(MODULE_DIRECTORY / "verify-word-audio.mjs")],
        cwd=PROJECT_ROOT,
        check=True,
    )


if __name__ == "__main__":
    generate()
