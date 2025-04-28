@echo off
setlocal

set SERVICE_NAME=PrintMiddleware
set EXEC_PATH=C:\PrintMiddleware

echo.
echo ===== UNINSTALLING PRINT MIDDLEWARE =====
echo.

rem Parar e remover o serviço se existir
sc query %SERVICE_NAME% >nul 2>&1
if %errorlevel% equ 0 (
    echo Stopping service %SERVICE_NAME%...
    sc stop %SERVICE_NAME% >nul
    timeout /t 3 >nul
    echo Deleting service %SERVICE_NAME%...
    sc delete %SERVICE_NAME% >nul
)

rem Matar o processo print-middleware.exe se estiver rodando
tasklist /FI "IMAGENAME eq print-middleware.exe" 2>NUL | find /I /N "print-middleware.exe">NUL
if "%errorlevel%"=="0" (
    echo Killing print-middleware.exe process...
    taskkill /F /IM print-middleware.exe >nul
)

rem Deletar arquivos principais
if exist "%EXEC_PATH%\print-middleware.exe" (
    del /f "%EXEC_PATH%\print-middleware.exe"
)

if exist "%EXEC_PATH%\print-middleware-service.exe" (
    del /f "%EXEC_PATH%\print-middleware-service.exe"
)

if exist "%EXEC_PATH%\print-middleware-service.xml" (
    del /f "%EXEC_PATH%\print-middleware-service.xml"
)

if exist "%EXEC_PATH%\PDFtoPrinter.exe" (
    del /f "%EXEC_PATH%\PDFtoPrinter.exe"
)

rem Deletar pastas labels e logs
if exist "%EXEC_PATH%\labels" (
    rmdir /s /q "%EXEC_PATH%\labels"
)

if exist "%EXEC_PATH%\logs" (
    rmdir /s /q "%EXEC_PATH%\logs"
)

echo.

rem Pergunta se deseja remover toda a pasta
set /p DELETE_FOLDER="Do you want to remove the entire PrintMiddleware folder? (y/n): "
if /i "%DELETE_FOLDER%"=="y" (
    rmdir /s /q "%EXEC_PATH%"
    echo Folder removed.
) else (
    echo Folder preserved.
)

echo.
echo UNINSTALLATION COMPLETED.
pause
