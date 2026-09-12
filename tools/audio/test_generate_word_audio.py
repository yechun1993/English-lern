import tempfile
import unittest
import importlib.util
from hashlib import sha256
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("generate-word-audio.py")
SPEC = importlib.util.spec_from_file_location("generate_word_audio", MODULE_PATH)
assert SPEC is not None and SPEC.loader is not None
generate_word_audio = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(generate_word_audio)
MODEL_REVISION = generate_word_audio.MODEL_REVISION
prepare_model_assets = generate_word_audio.prepare_model_assets
prepare_espeak_data_path = generate_word_audio.prepare_espeak_data_path


class PrepareModelAssetsTests(unittest.TestCase):
    def test_downloads_the_exact_revision_then_reuses_local_assets(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            model_directory = Path(temporary_directory)
            calls: list[dict[str, object]] = []

            def downloader(**kwargs: object) -> str:
                calls.append(kwargs)
                target = Path(str(kwargs["local_dir"])) / str(kwargs["filename"])
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(b"asset")
                return str(target)

            assets = prepare_model_assets(model_directory, downloader=downloader, expected_hashes=None)

            self.assertEqual([call["revision"] for call in calls], [MODEL_REVISION] * 3)
            self.assertEqual(
                [call["filename"] for call in calls],
                ["config.json", "kokoro-v1_0.pth", "voices/af_heart.pt"],
            )
            self.assertTrue(assets.config_path.is_file())
            self.assertTrue(assets.model_path.is_file())
            self.assertTrue(assets.voice_path.is_file())

            prepare_model_assets(
                model_directory,
                downloader=lambda **_: self.fail("完整本地资产不应再次联网"),
                expected_hashes=None,
            )

    def test_rejects_an_empty_downloaded_asset(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            model_directory = Path(temporary_directory)

            def downloader(**kwargs: object) -> str:
                target = Path(str(kwargs["local_dir"])) / str(kwargs["filename"])
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(b"" if kwargs["filename"] == "config.json" else b"asset")
                return str(target)

            with self.assertRaisesRegex(RuntimeError, "模型资产为空：config.json"):
                prepare_model_assets(model_directory, downloader=downloader, expected_hashes=None)

    def test_rejects_an_asset_with_the_wrong_sha256(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            model_directory = Path(temporary_directory)

            def downloader(**kwargs: object) -> str:
                target = Path(str(kwargs["local_dir"])) / str(kwargs["filename"])
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(b"wrong" if kwargs["filename"] == "config.json" else b"asset")
                return str(target)

            expected_hashes = {
                "config.json": sha256(b"expected").hexdigest(),
                "kokoro-v1_0.pth": sha256(b"asset").hexdigest(),
                "voices/af_heart.pt": sha256(b"asset").hexdigest(),
            }
            with self.assertRaisesRegex(RuntimeError, "模型资产哈希不匹配：config.json"):
                prepare_model_assets(
                    model_directory,
                    downloader=downloader,
                    expected_hashes=expected_hashes,
                )


class PrepareEspeakDataPathTests(unittest.TestCase):
    def test_copies_espeak_data_to_an_ascii_runtime_path_and_reuses_it(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            source = root / "source" / "espeak-ng-data"
            target_root = root / "runtime"
            source.mkdir(parents=True)
            (source / "phontab").write_bytes(b"phoneme table")

            result = prepare_espeak_data_path(source, target_root)

            self.assertEqual(result, target_root / "espeak-ng-data")
            self.assertEqual((result / "phontab").read_bytes(), b"phoneme table")
            (source / "phontab").write_bytes(b"changed source")
            self.assertEqual(prepare_espeak_data_path(source, target_root), result)
            self.assertEqual((result / "phontab").read_bytes(), b"phoneme table")

    def test_rejects_an_incomplete_espeak_source(self) -> None:
        with tempfile.TemporaryDirectory() as temporary_directory:
            root = Path(temporary_directory)
            source = root / "missing-data"
            source.mkdir()
            with self.assertRaisesRegex(RuntimeError, "eSpeak NG 数据不完整"):
                prepare_espeak_data_path(source, root / "runtime")


class RequireEnglishSpacyModelTests(unittest.TestCase):
    def test_accepts_the_pinned_english_model(self) -> None:
        generate_word_audio.require_english_spacy_model(
            is_package=lambda name: name == "en_core_web_sm",
        )

    def test_rejects_a_missing_english_model_before_generation(self) -> None:
        with self.assertRaisesRegex(RuntimeError, "en_core_web_sm==3.8.0"):
            generate_word_audio.require_english_spacy_model(is_package=lambda _: False)


if __name__ == "__main__":
    unittest.main()
