@echo off
setlocal
cd /d "%~dp0"
title SZU Degree English Public Edition
echo.
echo Starting the public local learning site...
echo Keep this window open while using the site.
echo.
"%~dp0node.exe" "%~dp0server.mjs" --open
echo.
echo The local service has stopped. Press any key to close this window.
pause >nul
