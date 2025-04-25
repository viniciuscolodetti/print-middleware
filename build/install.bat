@echo off
setlocal

set SERVICE_NAME=PrintMiddleware
set EXEC_PATH=C:\PrintMiddleware
set SUMATRA_URL=https://www.sumatrapdfreader.org/dl/rel/3.5.2/SumatraPDF-3.5.2-64.zip
set SUMATRA_ZIP=%EXEC_PATH%\SumatraPDF.zip
set SUMATRA_FOLDER=%EXEC_PATH%\SumatraPDF
set SUMATRA_EXE=%EXEC_PATH%\SumatraPDF.exe
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

rem Baixar e extrair o SumatraPDF se nao existir
if not exist "%SUMATRA_EXE%" (
    echo Downloading SumatraPDF.zip...
    powershell -Command "Invoke-WebRequest -Uri '%SUMATRA_URL%' -OutFile '%SUMATRA_ZIP%'"
    
    if exist "%SUMATRA_ZIP%" (
        echo Extracting SumatraPDF.zip...
        powershell -Command "Expand-Archive -LiteralPath '%SUMATRA_ZIP%' -DestinationPath '%SUMATRA_FOLDER%' -Force"
        
        echo Locating extracted SumatraPDF executable...
        for %%f in (%SUMATRA_FOLDER%\\*.exe) do (
            move "%%f" "%SUMATRA_EXE%"
        )
        
        echo Cleaning up extracted files...
        rmdir /s /q "%SUMATRA_FOLDER%"
        del /f "%SUMATRA_ZIP%"
    ) else (
        echo ERROR: Failed to download SumatraPDF.zip
        pause
        exit /b
    )
)

if not exist "%SUMATRA_EXE%" (
    echo ERROR: SumatraPDF.exe not found after extraction
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
