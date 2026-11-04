@echo off
echo ==========================================================
echo   MediShare MySQL Database Initializer
echo ==========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0init-database.ps1" %*
pause
