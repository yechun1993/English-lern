@echo off
setlocal

cd /d "%~dp0web"

echo.
echo Starting the local degree-English study site...
echo Keep this window open while using the site on this computer or tablet.
echo.

call npm run build
if errorlevel 1 (
  echo.
  echo Build failed. Keep this window open and contact the project maintainer.
  pause
  exit /b 1
)

call npm run serve:lan -- --open
