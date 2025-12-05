# Ticket Review Script
# Usage: .\ticket-review.ps1 TICKET-001

param(
    [Parameter(Mandatory=$true)]
    [string]$TicketId,
    
    [ValidateSet("start", "complete")]
    [string]$ReviewType = "complete"
)

$ticketsDir = Join-Path $PSScriptRoot "../../.tickets"
$ticketDir = Get-ChildItem -Path $ticketsDir -Directory | Where-Object { $_.Name -like "$TicketId*" } | Select-Object -First 1

if (-not $ticketDir) {
    Write-Host "Ticket not found: $TicketId" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "REVIEW REQUEST: $($ticketDir.Name)" -ForegroundColor Magenta
Write-Host "Review Type: $ReviewType" -ForegroundColor Cyan
Write-Host "=" * 60
Write-Host ""

# Show Request.md
$requestPath = Join-Path $ticketDir.FullName "Request.md"
if (Test-Path $requestPath) {
    Write-Host "=== REQUEST ===" -ForegroundColor Yellow
    Get-Content $requestPath
    Write-Host ""
}

# Show TaskList.md
$taskPath = Join-Path $ticketDir.FullName "TaskList.md"
if (Test-Path $taskPath) {
    Write-Host "=== TASK LIST ===" -ForegroundColor Yellow
    Get-Content $taskPath
    Write-Host ""
}

# Show Discussion.md (decisions and WHY)
$discussionPath = Join-Path $ticketDir.FullName "Discussion.md"
if (Test-Path $discussionPath) {
    Write-Host "=== DISCUSSION (WHY) ===" -ForegroundColor Yellow
    Get-Content $discussionPath
    Write-Host ""
}

# If completion review, show Summary.md if it exists
if ($ReviewType -eq "complete") {
    $summaryPath = Join-Path $ticketDir.FullName "Summary.md"
    if (Test-Path $summaryPath) {
        Write-Host "=== SUMMARY ===" -ForegroundColor Yellow
        Get-Content $summaryPath
        Write-Host ""
    }
}

Write-Host "=" * 60
Write-Host ""
Write-Host "REVIEW ACTIONS:" -ForegroundColor Green
Write-Host "  [A] Approve - Mark as approved and proceed"
Write-Host "  [R] Request Changes - Add notes and return to in_progress"
Write-Host "  [Q] Questions - Need clarification before deciding"
Write-Host ""

$action = Read-Host "Enter action (A/R/Q)"

switch ($action.ToUpper()) {
    "A" {
        Write-Host "Approved! Update ticket status to proceed." -ForegroundColor Green
    }
    "R" {
        $notes = Read-Host "Enter change request notes"
        Write-Host "Changes requested. Notes: $notes" -ForegroundColor Yellow
    }
    "Q" {
        $question = Read-Host "Enter your question"
        Write-Host "Question logged: $question" -ForegroundColor Cyan
    }
}

