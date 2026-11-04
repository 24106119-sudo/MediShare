# ==============================================================================
# MediShare Backend Runner
# Starts Spring Boot 3 + Kotlin Backend with live MySQL connection
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Starting MediShare Kotlin Spring Boot Backend" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

Set-Location "$PSScriptRoot\..\backend"
.\gradlew.bat bootRun
