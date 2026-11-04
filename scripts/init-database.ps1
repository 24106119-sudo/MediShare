# ==============================================================================
# MediShare Database Initialization Script
# Executes schema.sql and seed.sql into MySQL
# ==============================================================================

param (
    [string]$DbUser = "root",
    [string]$DbPass = "",
    [string]$DbHost = "localhost",
    [int]$DbPort = 3306,
    [string]$DbName = "medishare_db"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  MediShare MySQL Database Initializer" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$MysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
if (-not (Test-Path $MysqlPath)) {
    $found = Get-Command mysql -ErrorAction SilentlyContinue
    if ($found) {
        $MysqlPath = $found.Source
    } else {
        Write-Error "Could not locate mysql.exe client."
        exit 1
    }
}

$SchemaPath = Join-Path $PSScriptRoot "..\database\schema.sql"
$SeedPath = Join-Path $PSScriptRoot "..\database\seed.sql"

$authArg = "-u$DbUser"
if ($DbPass -ne "") {
    $authArg = "-u$DbUser -p$DbPass"
}

Write-Host "Executing schema definition ($SchemaPath)..." -ForegroundColor Yellow
& $MysqlPath -h $DbHost -P $DbPort -u $DbUser -e "source $SchemaPath"

Write-Host "Executing seed records ($SeedPath)..." -ForegroundColor Yellow
& $MysqlPath -h $DbHost -P $DbPort -u $DbUser -D $DbName -e "source $SeedPath"

Write-Host "Database successfully initialized!" -ForegroundColor Green
Write-Host "Verifying tables in ${DbName}:" -ForegroundColor Cyan
& $MysqlPath -h $DbHost -P $DbPort -u $DbUser -D $DbName -e "SHOW TABLES;"
