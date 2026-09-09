@echo off
setlocal
cd /d "%~dp0"
node "%~dp0tools\public-release\generate-package.mjs"
set "exitCode=%errorlevel%"
echo.
if not "%exitCode%"=="0" echo The public release package was not created. Read the message above and try again.
pause
exit /b %exitCode%
