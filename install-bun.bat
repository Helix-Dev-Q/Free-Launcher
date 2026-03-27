@echo off
echo Installing Bun...
powershell -ExecutionPolicy Bypass -Command "irm bun.sh/install.ps1 | iex"
if %errorlevel% neq 0 (
    echo Failed to install Bun.
    pause
    exit /b 1
)
echo.
echo Bun installed successfully.
echo You may need to restart your terminal for PATH changes to take effect.
pause
