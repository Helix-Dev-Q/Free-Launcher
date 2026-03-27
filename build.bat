@echo off
echo Checking for Bun...
where bun >nul 2>&1
if %errorlevel% neq 0 (
    echo Bun not found. Run install-bun.bat first.
    pause
    exit /b 1
)

echo Installing dependencies...
bun install
if %errorlevel% neq 0 (
    echo Dependency installation failed.
    pause
    exit /b 1
)

echo Building Next.js...
bun tauri build
if %errorlevel% neq 0 (
    echo Build failed.
    pause
    exit /b 1
)

echo.
echo Build complete.
pause
