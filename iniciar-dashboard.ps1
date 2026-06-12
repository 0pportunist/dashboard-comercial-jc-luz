$ErrorActionPreference = 'Stop'

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 5173
$url = "http://127.0.0.1:$port"
$logDirectory = Join-Path $projectPath '.logs'
$stdoutLog = Join-Path $logDirectory 'vite.log'
$stderrLog = Join-Path $logDirectory 'vite-error.log'

New-Item -ItemType Directory -Force -Path $logDirectory | Out-Null

$listener = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($listener) {
  Start-Process $url
  Write-Host "Dashboard ja esta rodando em $url"
  exit 0
}

$nodeCandidates = @(
  (Get-Command node.exe -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source -ErrorAction SilentlyContinue),
  (Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'),
  (Join-Path $env:TEMP 'jc-luz-node\node-v22.17.0-win-x64\node.exe')
) | Where-Object { $_ -and (Test-Path -LiteralPath $_) }

$nodeExecutable = $nodeCandidates | Select-Object -First 1
if (-not $nodeExecutable) {
  throw 'Node.js nao foi encontrado. Instale o Node.js LTS para iniciar o dashboard.'
}

$viteEntry = Join-Path $projectPath 'node_modules\vite\bin\vite.js'
if (-not (Test-Path -LiteralPath $viteEntry)) {
  throw 'Dependencias ausentes. Execute npm install antes de iniciar o dashboard.'
}

Remove-Item $stdoutLog, $stderrLog -Force -ErrorAction SilentlyContinue

Start-Process `
  -FilePath $nodeExecutable `
  -ArgumentList "`"$viteEntry`" --host 127.0.0.1 --port $port --strictPort" `
  -WorkingDirectory $projectPath `
  -WindowStyle Hidden `
  -RedirectStandardOutput $stdoutLog `
  -RedirectStandardError $stderrLog

$isReady = $false
for ($attempt = 0; $attempt -lt 20; $attempt++) {
  Start-Sleep -Milliseconds 500
  try {
    $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
    if ($response.StatusCode -eq 200) {
      $isReady = $true
      break
    }
  } catch {
    # O Vite ainda esta inicializando.
  }
}

if (-not $isReady) {
  $details = Get-Content $stderrLog -Raw -ErrorAction SilentlyContinue
  throw "O dashboard nao iniciou corretamente. Consulte $stderrLog. $details"
}

Start-Process $url
Write-Host "Dashboard iniciado em $url"
