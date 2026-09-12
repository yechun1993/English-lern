# 单词离线美式音频生成

公开 Release ZIP 内的单词发音由本工具一次性生成。源码仓库不提交 MP3、模型权重、缓存或临时 WAV。

固定参数：`kokoro==0.9.4`、`en_core_web_sm==3.8.0`、`hexgrad/Kokoro-82M` 修订 `f3ff3571791e39611d31c381e3a41a3af07b4987`、美式女声 `af_heart`、语速 `1.0`，输出为 24 kHz、单声道、48 kb/s MP3。

## Windows 生成步骤

先确认 Python 3.10、Node.js 和 FFmpeg 可用：

```powershell
py -3.10 --version
node --version
ffmpeg -version
```

在项目根目录创建独立虚拟环境并安装固定依赖：

```powershell
py -3.10 -m venv tools/audio/.venv
tools/audio/.venv/Scripts/python.exe -m pip install -r tools/audio/requirements.txt
```

其中 spaCy 英语模型固定使用其官方 GitHub Release wheel；该 wheel 的 SHA-256 为 `1932429db727d4bff3deed6b34cfc05df17794f4a52eeb26cf8928f7c1a0fb85`。生成器会在加载语音模型前检查它，缺失时明确报错，不会在批量生成途中临时联网下载。

首次生成会把该固定修订的 `config.json`、`kokoro-v1_0.pth` 和 `voices/af_heart.pt` 下载到被 Git 忽略的本地缓存。网络无法直连 Hugging Face 时，可只在当前终端指定可信镜像：

```powershell
$env:HF_ENDPOINT = 'https://hf-mirror.com'
tools/audio/.venv/Scripts/python.exe tools/audio/generate-word-audio.py
```

目标目录中已存在任何 MP3 时，脚本会拒绝继续，防止混入不同批次；明确重建整批时使用：

```powershell
tools/audio/.venv/Scripts/python.exe tools/audio/generate-word-audio.py --overwrite
```

脚本每完成 25 个单词报告一次进度，全部生成后自动调用严格校验器。也可单独复验：

```powershell
node tools/audio/verify-word-audio.mjs
```

Windows 版 eSpeak NG 的底层库无法稳定读取含中文字符的数据目录。生成器会自动把其只读数据复制到系统临时目录中的纯 ASCII 路径，再初始化音素转换；不会修改 Python 环境或系统配置。

生成器会校验三项模型资产的 SHA-256，只有固定修订、固定声线的正确文件才能参与生成。校验值直接保存在 `generate-word-audio.py` 中。

校验器要求文件名与 `word-audio-manifest.json` 一一对应、文件非空，并使用 FFmpeg 对每个 MP3 解码。只有 1,911 个文件全部通过后，公开版打包工具才会继续。
