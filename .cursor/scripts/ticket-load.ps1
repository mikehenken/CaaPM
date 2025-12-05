# Ticket Load Script
# Usage: .\ticket-load.ps1 TICKET-001

param(
    [Parameter(Mandatory=$true)]
    [string]$TicketId
)

$ticketsDir = Join-Path $PSScriptRoot "../../.tickets"
$ticketDir = Get-ChildItem -Path $ticketsDir -Directory | Where-Object { $_.Name -like "$TicketId*" } | Select-Object -First 1

if (-not $ticketDir) {
    Write-Host "Ticket not found: $TicketId" -ForegroundColor Red
    Write-Host ""
    Write-Host "Available tickets:" -ForegroundColor Yellow
    Get-ChildItem -Path $ticketsDir -Directory -Name
    exit 1
}

Write-Host ""
Write-Host "Loading ticket: $($ticketDir.Name)" -ForegroundColor Cyan
Write-Host "=" * 60

$files = @("Request.md", "TaskList.md", "Discussion.md", "Implementation_Plan.md")

foreach ($file in $files) {
    $filePath = Join-Path $ticketDir.FullName $file
    if (Test-Path $filePath) {
        Write-Host ""
        Write-Host "=== $file ===" -ForegroundColor Yellow
        Get-Content $filePath | Select-Object -First 50
        Write-Host "..."
    }
}

Write-Host ""
Write-Host "=" * 60
Write-Host "Ticket loaded. Copy the above to your AI chat for context." -ForegroundColor Green

