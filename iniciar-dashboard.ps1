$ErrorActionPreference = 'Stop'

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 5173
$localUrl = "http://localhost:$port"
$hostUrl = "http://$($env:COMPUTERNAME):$port"
$networkAddress = Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object {
    $_.IPAddress -notlike '127.*' -and
    $_.IPAddress -notlike '169.254.*' -and
    $_.PrefixOrigin -ne 'WellKnown'
  } |
  Sort-Object InterfaceMetric |
  Select-Object -First 1 -ExpandProperty IPAddress
$networkUrl = if ($networkAddress) { "http://${networkAddress}:$port" } else { $null }
$accessFile = Join-Path $projectPath 'ACESSO-REDE-LOCAL.txt'
$logDirectory = Join-Path $projectPath '.logs'
$stdoutLog = Join-Path $logDirectory 'vite.log'
$stderrLog = Join-Path $logDirectory 'vite-error.log'

New-Item -ItemType Directory -Force -Path $logDirectory | Out-Null

function Write-AccessFile {
  $lines = @(
    'DASHBOARD COMERCIAL JC LUZ'
    ''
    "Neste computador: $localUrl/login"
    "Nome da maquina: $hostUrl/login"
  )

  if ($networkUrl) {
    $lines += "IP atual: $networkUrl/login"
  }

  $lines += @(
    ''
    'Compartilhe o endereco por nome ou o IP atual com quem estiver na mesma rede.'
    'O IP pode mudar quando o computador ou roteador for reiniciado.'
  )

  Set-Content -LiteralPath $accessFile -Value $lines -Encoding UTF8
}

$listener = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($listener) {
  Write-AccessFile
  Start-Process $localUrl
  Write-Host "Dashboard ja esta rodando em $localUrl"
  Write-Host "Endereco estavel na rede: $hostUrl"
  if ($networkUrl) {
    Write-Host "Acesso na rede local: $networkUrl"
  }
  Write-Host "Enderecos salvos em $accessFile"
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
  -ArgumentList "`"$viteEntry`" --host 0.0.0.0 --port $port --strictPort" `
  -WorkingDirectory $projectPath `
  -WindowStyle Hidden `
  -RedirectStandardOutput $stdoutLog `
  -RedirectStandardError $stderrLog

$isReady = $false
for ($attempt = 0; $attempt -lt 20; $attempt++) {
  Start-Sleep -Milliseconds 500
  $client = [System.Net.Sockets.TcpClient]::new()
  try {
    $connectTask = $client.ConnectAsync('127.0.0.1', $port)
    $isReady = $connectTask.Wait(1000) -and $client.Connected
  } catch {
    $isReady = $false
  } finally {
    $client.Dispose()
  }

  if ($isReady) {
    break
  }
}

if (-not $isReady) {
  $details = Get-Content $stderrLog -Raw -ErrorAction SilentlyContinue
  throw "O dashboard nao iniciou corretamente. Consulte $stderrLog. $details"
}

Write-AccessFile
Start-Process $localUrl
Write-Host "Dashboard iniciado em $localUrl"
Write-Host "Endereco estavel na rede: $hostUrl"
if ($networkUrl) {
  Write-Host "Compartilhe com a equipe: $networkUrl"
}
Write-Host "Enderecos salvos em $accessFile"
