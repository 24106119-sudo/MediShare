# ==============================================================================
# MediShare MySQL Daemon Helper
# Starts or ensures MySQL 8.0 server is running on port 3306
# ==============================================================================

Write-Host "Checking MySQL server on port 3306..." -ForegroundColor Cyan

$testConn = Test-NetConnection -ComputerName localhost -Port 3306 -WarningAction SilentlyContinue
if ($testConn.TcpTestSucceeded) {
    Write-Host "MySQL server is ALREADY running and accepting connections on port 3306." -ForegroundColor Green
    exit 0
}

Write-Host "Port 3306 not responding. Starting MySQL server..." -ForegroundColor Yellow

$MyIni = "C:\Users\Rohini\.mysql_local_data\my.ini"
$Mysqld = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe"

if (Test-Path $Mysqld) {
    Start-Process -FilePath $Mysqld -ArgumentList "--defaults-file=`"$MyIni`" --console" -WindowStyle Minimized
    Start-Sleep -Seconds 3
    Write-Host "MySQL server started successfully." -ForegroundColor Green
} else {
    Write-Error "Could not locate mysqld.exe at $Mysqld"
}
