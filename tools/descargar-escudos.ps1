# Descarga los escudos de los clubes de la versión real desde TheSportsDB (API v1 gratuita, clave pública 123)
# y crea js/escudos-reales.js para que el juego los use. Solo para pruebas y uso particular: los escudos son de los clubes.
# Uso (desde la carpeta del juego, después de convertir-datos.ps1):
#   powershell -ExecutionPolicy Bypass -File tools\descargar-escudos.ps1
# Respeta el límite de la API (30 peticiones por minuto) esperando entre llamadas. Las imágenes van a la carpeta escudos/.
param(
  [string]$Juego = (Join-Path $PSScriptRoot '..'),
  [string]$Clave = '123',
  [double]$Pausa = 2.5
)
$ErrorActionPreference = 'Stop'
$api = "https://www.thesportsdb.com/api/v1/json/$Clave"
$datos = Join-Path $Juego 'js\datos-reales.js'
if (-not (Test-Path $datos)) { throw 'No existe js\datos-reales.js. Ejecuta antes tools\convertir-datos.ps1.' }
$dir = Join-Path $Juego 'escudos'; New-Item -ItemType Directory -Force $dir | Out-Null

# nombres de los clubes del juego (ligas e invitados)
$txt = [IO.File]::ReadAllText($datos)
$clubes = [regex]::Matches($txt, '\{n:"([^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique
Write-Host ("Clubes en el juego: {0}" -f $clubes.Count)

# ligas de TheSportsDB que cubren esos clubes (se comprueban contra all_leagues.php)
$buscadas = @('Spanish La Liga','English Premier League','Italian Serie A','German Bundesliga','French Ligue 1','Portuguese Primeira Liga','Dutch Eredivisie',
  'Turkish Super Lig','Scottish Premier League','Belgian Pro League','Austrian Bundesliga','Greek Superleague Greece','Swiss Super League','Czech First League',
  'Danish Superliga','Norwegian Eliteserien','Swedish Allsvenskan','Croatian First Football League','Serbian Super Liga','Ukrainian Premier League','Polish Ekstraklasa','Romanian Liga I')
function Get-Api($url) { Start-Sleep -Seconds $Pausa; return Invoke-RestMethod -Uri $url -UseBasicParsing -TimeoutSec 30 }
$todas = (Get-Api "$api/all_leagues.php").leagues | Where-Object { $_.strSport -eq 'Soccer' }
function Norm([string]$s) {
  $s = $s.Normalize([Text.NormalizationForm]::FormD) -replace '\p{Mn}', ''
  $s = $s.ToLower() -replace '[^a-z0-9 ]', ' '
  $stop = 'fc','cf','sc','ac','as','afc','club','de','cd','ud','sd','rc','rcd','ss','us','sv','vfl','vfb','fk','sk','the','and','kv','krc','rsc','gnk','hnk','calcio','football','futebol','1','04','05','1846','1893','1907','1909','1913'
  return (($s -split '\s+') | Where-Object { $_ -and ($stop -notcontains $_) }) -join ' '
}
function Score($a, $b) {
  $ta = (Norm $a) -split ' '; $tb = (Norm $b) -split ' '
  if (-not $ta -or -not $tb) { return 0 }
  $comun = @($ta | Where-Object { $tb -contains $_ }).Count
  return $comun / [math]::Max($ta.Count, $tb.Count)
}
$equipos = @()
foreach ($l in $buscadas) {
  $liga = $todas | Where-Object { $_.strLeague -eq $l } | Select-Object -First 1
  if (-not $liga) { $liga = $todas | Where-Object { $_.strLeague -like "*$($l.Split(' ')[-1])*" -and $_.strLeague -like "$($l.Split(' ')[0])*" } | Select-Object -First 1 }
  if (-not $liga) { Write-Warning "Liga no encontrada en TheSportsDB: $l"; continue }
  $r = Get-Api ("$api/search_all_teams.php?l=" + [uri]::EscapeDataString($liga.strLeague))
  $n = @($r.teams).Count; Write-Host ("{0}: {1} equipos" -f $liga.strLeague, $n)
  $equipos += @($r.teams)
}
$mapa = [ordered]@{}; $sin = @()
foreach ($c in $clubes) {
  $mejor = $null; $ms = 0
  foreach ($e in $equipos) {
    if (-not $e.strBadge) { continue }
    $cands = @($e.strTeam) + (@($e.strTeamAlternate) -split ',') + @($e.strTeamShort)
    foreach ($x in $cands) { if ($x) { $s = Score $c $x; if ($s -gt $ms) { $ms = $s; $mejor = $e } } }
  }
  if ($mejor -and $ms -ge 0.5) {
    $slug = ((Norm $c) -replace ' ', '-'); if (-not $slug) { $slug = 'club' + $mapa.Count }
    $archivo = Join-Path $dir "$slug.png"
    if (-not (Test-Path $archivo)) {
      try { Invoke-WebRequest -Uri ($mejor.strBadge + '/small') -OutFile $archivo -UseBasicParsing -TimeoutSec 30 }
      catch { try { Invoke-WebRequest -Uri $mejor.strBadge -OutFile $archivo -UseBasicParsing -TimeoutSec 30 } catch { Write-Warning "No se pudo bajar el escudo de $c"; continue } }
      Start-Sleep -Milliseconds 300
    }
    $mapa[$c] = "escudos/$slug.png"
  } else { $sin += $c }
}
$js = "/* Generado por tools/descargar-escudos.ps1 desde TheSportsDB. Solo para pruebas y uso particular. Los escudos pertenecen a sus clubes. */`nvar ESCUDOS={" +
  (($mapa.Keys | ForEach-Object { '"' + ($_ -replace '"','\"') + '":"' + $mapa[$_] + '"' }) -join ",`n") + "};`n"
[IO.File]::WriteAllText((Join-Path $Juego 'js\escudos-reales.js'), $js, (New-Object Text.UTF8Encoding $false))
Write-Host ("Hecho: {0} escudos. Sin escudo (usarán el generado): {1}" -f $mapa.Count, $sin.Count)
if ($sin.Count) { Write-Host ('  ' + ($sin -join ', ')) }
