# Ticket Creation Script
# Usage: .\ticket-create.ps1

param(
    [string]$Title,
    [ValidateSet("simple", "task_list", "plan")]
    [string]$Complexity = "task_list",
    [string]$Service = "all",
    [string]$Estimate,
    [string]$OwnerPerson,
    [string]$OwnerAgent,
    [switch]$CreateAssetsFolder
)

$ErrorActionPreference = "Stop"

# Get next ticket number
$ticketsDir = Join-Path $PSScriptRoot "../../.tickets"
if (-not (Test-Path $ticketsDir)) {
    New-Item -ItemType Directory -Path $ticketsDir | Out-Null
}

$existingTickets = Get-ChildItem -Path $ticketsDir -Directory -Name | Where-Object { $_ -match "^TICKET-(\d+)" }
$maxNum = 0
foreach ($t in $existingTickets) {
    if ($t -match "TICKET-(\d+)") {
        $num = [int]$Matches[1]
        if ($num -gt $maxNum) { $maxNum = $num }
    }
}
$nextNum = $maxNum + 1
$ticketNum = "TICKET-{0:D3}" -f $nextNum

# Prompt for title if not provided
if (-not $Title) {
    $Title = Read-Host "Enter ticket title"
}

# Create slug from title
$slug = $Title.ToLower() -replace '[^a-z0-9]+', '-' -replace '^-|-$', ''
$ticketDir = Join-Path $ticketsDir "$ticketNum-$slug"

Write-Host "Creating ticket: $ticketNum - $Title" -ForegroundColor Cyan

# Create directory
New-Item -ItemType Directory -Path $ticketDir | Out-Null

# Create assets folder if requested
if ($CreateAssetsFolder) {
    $assetsDir = Join-Path $ticketDir "assets"
    New-Item -ItemType Directory -Path $assetsDir | Out-Null
    Write-Host "  Created assets folder" -ForegroundColor DarkGray
}

# Copy templates
$templatesDir = Join-Path $PSScriptRoot "../templates/ticket"
Copy-Item "$templatesDir/Request.md" "$ticketDir/Request.md"
Copy-Item "$templatesDir/TaskList.md" "$ticketDir/TaskList.md"
Copy-Item "$templatesDir/Discussion.md" "$ticketDir/Discussion.md"

if ($Complexity -eq "plan") {
    Copy-Item "$templatesDir/Implementation_Plan.md" "$ticketDir/Implementation_Plan.md"
    Copy-Item "$templatesDir/Analysis.md" "$ticketDir/Analysis.md"
}

# Update Request.md with ticket info
$requestFile = Join-Path $ticketDir "Request.md"
$content = Get-Content $requestFile -Raw
$content = $content -replace '\[TICKET-XXX\]', "[$ticketNum]"
$content = $content -replace '\{Title\}', $Title
$content = $content -replace '\{date\}', (Get-Date -Format "yyyy-MM-dd")
$content = $content -replace 'simple \| task_list \| plan', $Complexity
$content = $content -replace 'backend \| frontend \| landing \| infra \| all', $Service

# Update estimate if provided
if ($Estimate) {
    $content = $content -replace '(\*\*Estimate\*\*: )', "`$1$Estimate"
}

# Update owner person if provided
if ($OwnerPerson) {
    $content = $content -replace 'Person: github:\{username\}', "Person: github:$OwnerPerson"
}

# Update owner agent if provided
if ($OwnerAgent) {
    $content = $content -replace 'model: \{model-name\}', "model: $OwnerAgent"
}

Set-Content $requestFile $content

# Update TaskList.md with ticket number
$taskFile = Join-Path $ticketDir "TaskList.md"
$taskContent = Get-Content $taskFile -Raw
$taskContent = $taskContent -replace '\[TICKET-XXX\]', "[$ticketNum]"
Set-Content $taskFile $taskContent

# Update Discussion.md with ticket number
$discussFile = Join-Path $ticketDir "Discussion.md"
$discussContent = Get-Content $discussFile -Raw
$discussContent = $discussContent -replace '\[TICKET-XXX\]', "[$ticketNum]"
Set-Content $discussFile $discussContent

Write-Host ""
Write-Host "Created: $ticketDir" -ForegroundColor Green
Write-Host ""
Write-Host "Files created:" -ForegroundColor DarkGray
Write-Host "  - Request.md (ticket definition)"
Write-Host "  - TaskList.md (progress tracking)"
Write-Host "  - Discussion.md (decisions & handoffs)"
if ($Complexity -eq "plan") {
    Write-Host "  - Implementation_Plan.md (PRD)"
    Write-Host "  - Analysis.md (research findings)"
}
if ($CreateAssetsFolder) {
    Write-Host "  - assets/ (design assets folder)"
}
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Edit Request.md with task details"
Write-Host "  2. Add design assets to assets/ folder (if applicable)"
Write-Host "  3. Tell the AI: 'Load ticket $ticketNum'"
Write-Host ""
