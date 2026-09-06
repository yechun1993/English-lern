@echo off
setlocal
cd /d "%~dp0"
node "%~dp0tools\authorization-package\generate-package.mjs"
set "exitCode=%errorlevel%"
echo.
if not "%exitCode%"=="0" echo The authorization package was not created. Read the message above and try again.
pause
exit /b %exitCode%
