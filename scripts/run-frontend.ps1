# ==============================================================================
# MediShare Frontend Runner
# Starts React + Vite dev server on port 5173
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Starting MediShare React Frontend (Vite)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

Set-Location "$PSScriptRoot\..\frontend"
npm run dev
