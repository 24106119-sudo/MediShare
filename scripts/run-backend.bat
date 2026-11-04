@echo off
echo ==========================================================
echo   Starting MediShare Kotlin Spring Boot Backend
echo ==========================================================
cd /d "%~dp0..\backend"
call gradlew.bat bootRun
pause
