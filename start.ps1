param(
    [int]$Port = 8000
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$python = Get-Command python -ErrorAction SilentlyContinue

if (-not $python) {
    $python = Get-Command py -ErrorAction SilentlyContinue
}

if (-not $python) {
    throw "Python nao foi encontrado. Instale Python 3 ou rode outro servidor HTTP local."
}

$listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($listener) {
    throw "A porta $Port ja esta em uso. Rode .\start.ps1 -Port 8001 ou encerre o processo que esta usando essa porta."
}

$url = "http://127.0.0.1:$Port/index.html"

Push-Location $root
try {
    $null = Start-Job -Name "stitch-open-browser-$Port" -ScriptBlock {
        param($TargetUrl)
        Start-Sleep -Seconds 2
        Start-Process $TargetUrl | Out-Null
    } -ArgumentList $url

    Write-Host ""
    Write-Host "Stitch Presentation Hub" -ForegroundColor Magenta
    Write-Host "Servidor local em $url" -ForegroundColor Cyan
    Write-Host "Pressione Ctrl + C para encerrar." -ForegroundColor DarkGray
    Write-Host ""

    & $python.Source -m http.server $Port --bind 127.0.0.1
}
finally {
    Get-Job -Name "stitch-open-browser-$Port" -ErrorAction SilentlyContinue | Remove-Job -Force -ErrorAction SilentlyContinue
    Pop-Location
}
