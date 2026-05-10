@echo off
TITLE Gemini CLI Environment Launcher

set "SCRIPT_DIR=%~dp0"

echo ===================================================
echo Starting CLI Proxy API Server in a new window...
echo ===================================================
start "CLI Proxy API" "%SCRIPT_DIR%cli-proxy-api.exe" -config "%SCRIPT_DIR%config.yaml"

:: Give the server 2 seconds sto initialize
timeout /t 2 /nobreak > NUL

echo.
echo ===================================================
echo Configuring Gemini CLI Environment...
echo ===================================================
set GEMINI_API_BASE_URL=http://127.0.0.1:8317

echo.
echo Launching Gemini CLI...
:: Using 'call' ensures the batch file doesn't unexpectedly terminate if gemini is also a script
call gemini %*

echo.
echo Gemini CLI session ended.
pause
