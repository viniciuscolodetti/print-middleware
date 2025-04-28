@echo off
setlocal

set SERVICE_NAME=PrintMiddleware
set EXEC_PATH=C:\PrintMiddleware
set PDFTOPRINTER_URL=https://github.com/emendelson/pdftoprinter/blob/main/PDFtoPrinter.exe?raw=true
set PDFTOPRINTER_EXE=%EXEC_PATH%\PDFtoPrinter.exe
set WINSW_URL=https://github.com/winsw/winsw/releases/download/v2.12.0/WinSW-x64.exe
set SERVICE_EXE=%EXEC_PATH%\print-middleware-service.exe

echo.
echo ===== INSTALLING PRINT MIDDLEWARE =====
echo.

if not exist "%EXEC_PATH%" (
    echo Creating PrintMiddleware folder...
    mkdir "%EXEC_PATH%"
)

if not exist "%EXEC_PATH%\labels" (
    echo Creating labels folder...
    mkdir "%EXEC_PATH%\labels"
)

cd /d "%EXEC_PATH%"

rem Baixar PDFtoPrinter.exe
if not exist "%PDFTOPRINTER_EXE%" (
    echo Downloading PDFtoPrinter.exe...
    powershell -Command "Invoke-WebRequest -Uri '%PDFTOPRINTER_URL%' -OutFile '%PDFTOPRINTER_EXE%'"
)

if not exist "%PDFTOPRINTER_EXE%" (
    echo ERROR: Failed to download PDFtoPrinter.exe
    pause
    exit /b
)

rem Baixar WinSW se nao existir
if not exist "%SERVICE_EXE%" (
    echo Downloading WinSW executable...
    powershell -Command "Invoke-WebRequest -Uri '%WINSW_URL%' -OutFile '%SERVICE_EXE%'"
)

if not exist "%SERVICE_EXE%" (
    echo ERROR: Failed to download WinSW
    pause
    exit /b
)

rem Remover serviço anterior se existir
sc query %SERVICE_NAME% >nul 2>&1
if %errorlevel% equ 0 (
    echo Service already exists. Stopping and removing...
    sc stop %SERVICE_NAME% >nul
    sc delete %SERVICE_NAME% >nul
)

echo Installing service %SERVICE_NAME%...
"%SERVICE_EXE%" install

echo.
echo ===================================
echo INSTALLATION COMPLETED!
echo.
echo IMPORTANT:
echo - Open "services.msc"
echo - Find service "%SERVICE_NAME%"
echo - Go to Properties > Log On tab
echo - Configure it to run with your Windows user
echo ===================================
echo.
pause
