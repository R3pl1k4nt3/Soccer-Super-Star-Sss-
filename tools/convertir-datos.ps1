# Convierte los CSV del dataset de Kaggle "player-scores" (datos de Transfermarkt) en js/datos-reales.js.
# Uso (desde la carpeta del juego):
#   powershell -ExecutionPolicy Bypass -File tools\convertir-datos.ps1 -Datos ..\datos
# Solo para uso particular y pruebas. El archivo generado no se sube a GitHub (.gitignore).
param(
  [string]$Datos = (Join-Path $PSScriptRoot '..\..\datos'),
  [string]$Salida = (Join-Path $PSScriptRoot '..\js\datos-reales.js'),
  [string]$Temporada = '2025',
  [int]$PorClub = 24
)
$ErrorActionPreference = 'Stop'
$ligas = @{ 'ES1'='ESP'; 'GB1'='ENG'; 'IT1'='ITA'; 'L1'='GER'; 'FR1'='FRA'; 'PO1'='POR'; 'NL1'='NED' }
$pos = @{ 'Goalkeeper'='POR'; 'Centre-Back'='DFC'; 'Left-Back'='LI'; 'Right-Back'='LD'; 'Defensive Midfield'='MCD'; 'Central Midfield'='MC';
  'Left Midfield'='VI'; 'Right Midfield'='VD'; 'Attacking Midfield'='MP'; 'Second Striker'='SD'; 'Centre-Forward'='DC'; 'Left Winger'='EI'; 'Right Winger'='ED' }
$posGen = @{ 'Goalkeeper'='POR'; 'Defender'='DFC'; 'Midfield'='MC'; 'Attack'='DC' }
# selecciones del juego (código) y nombres en español del resto de países
$nat = @{ 'Spain'='ESP'; 'France'='FRA'; 'England'='ENG'; 'Germany'='GER'; 'Italy'='ITA'; 'Portugal'='POR'; 'Netherlands'='NED'; 'Belgium'='BEL';
  'Croatia'='CRO'; 'Denmark'='DEN'; 'Switzerland'='SUI'; 'Austria'='AUT'; 'Serbia'='SRB'; 'Poland'='POL'; 'Norway'='NOR'; 'Sweden'='SWE';
  'Scotland'='SCO'; 'Wales'='WAL'; 'Ireland'='IRL'; 'Argentina'='ARG'; 'Brazil'='BRA'; 'Uruguay'='URU'; 'Colombia'='COL'; 'Mexico'='MEX';
  'United States'='USA'; 'Ecuador'='ECU'; 'Morocco'='MAR'; 'Senegal'='SEN'; 'Nigeria'='NGA'; 'Ghana'='GHA'; 'Japan'='JPN'; 'Korea, South'='KOR' }
$es = @{ 'Türkiye'='Turquía'; 'Cameroon'='Camerún'; "Cote d'Ivoire"='Costa de Marfil'; 'Algeria'='Argelia'; 'Tunisia'='Túnez'; 'Egypt'='Egipto';
  'Mali'='Malí'; 'Guinea'='Guinea'; 'DR Congo'='RD del Congo'; 'Ukraine'='Ucrania'; 'Russia'='Rusia'; 'Greece'='Grecia'; 'Czech Republic'='Chequia';
  'Slovakia'='Eslovaquia'; 'Slovenia'='Eslovenia'; 'Hungary'='Hungría'; 'Romania'='Rumanía'; 'Bosnia-Herzegovina'='Bosnia y Herzegovina';
  'Albania'='Albania'; 'Kosovo'='Kosovo'; 'North Macedonia'='Macedonia del Norte'; 'Montenegro'='Montenegro'; 'Georgia'='Georgia'; 'Armenia'='Armenia';
  'Iceland'='Islandia'; 'Finland'='Finlandia'; 'Northern Ireland'='Irlanda del Norte'; 'Paraguay'='Paraguay'; 'Chile'='Chile'; 'Peru'='Perú';
  'Venezuela'='Venezuela'; 'Canada'='Canadá'; 'Jamaica'='Jamaica'; 'Australia'='Australia'; 'Cape Verde'='Cabo Verde'; 'Gambia'='Gambia';
  'Burkina Faso'='Burkina Faso'; 'Angola'='Angola'; 'Gabon'='Gabón'; 'Israel'='Israel'; 'Iran'='Irán'; 'Luxembourg'='Luxemburgo';
  'Curacao'='Curazao'; 'Suriname'='Surinam'; 'Guinea-Bissau'='Guinea-Bisáu'; 'Equatorial Guinea'='Guinea Ecuatorial'; 'Togo'='Togo'; 'Benin'='Benín';
  'Zambia'='Zambia'; 'Zimbabwe'='Zimbabue'; 'Costa Rica'='Costa Rica'; 'Panama'='Panamá'; 'Honduras'='Honduras'; 'Bulgaria'='Bulgaria'; 'Lithuania'='Lituania' }
$nombreClub = @{ 'lazio-rom'='SS Lazio'; 'as-rom'='AS Roma'; 'fc-bologna'='Bologna FC'; '1-fc-heidenheim-1846'='1. FC Heidenheim'; 'fortuna-sittard'='Fortuna Sittard';
  'avs-futebol-sad'='AVS Futebol'; 'real-betis-sevilla'='Real Betis'; 'espanyol-barcelona'='RCD Espanyol'; 'brighton-amp-hove-albion'='Brighton & Hove Albion';
  'pisa-sporting-club'='Pisa SC'; 'ac-pisa-1909'='Pisa SC'; 'parma-calcio-1913'='Parma Calcio' }

function J([string]$s){ return '"' + ($s -replace '\\','\\' -replace '"','\"') + '"' }
$ref = [datetime]"$Temporada-09-01"

Write-Host "Leyendo clubes..."
$clubs = Import-Csv (Join-Path $Datos 'clubs.csv') -Encoding UTF8 | Where-Object { $_.last_season -eq $Temporada -and $ligas.ContainsKey($_.domestic_competition_id) }
Write-Host "Leyendo jugadores..."
$jug = Import-Csv (Join-Path $Datos 'players.csv') -Encoding UTF8 | Where-Object { $_.last_season -eq $Temporada -and $ligas.ContainsKey($_.current_club_domestic_competition_id) }
$grupos = $jug | Group-Object current_club_id -AsHashTable -AsString

$sb = New-Object System.Text.StringBuilder
[void]$sb.Append("/* Generado por tools/convertir-datos.ps1 a partir del dataset de Kaggle 'player-scores' (datos de Transfermarkt).`n   Solo para pruebas y uso particular. No comercial. Los nombres y valores pertenecen a sus titulares. */`n")
[void]$sb.Append("var REALDATA={temporada:'$Temporada-" + ([int]$Temporada + 1).ToString().Substring(2) + "',generado:'" + (Get-Date -Format 'yyyy-MM-dd') + "',lg:{`n")
$totalJ = 0
$primero = $true
foreach ($co in ($ligas.Values | Sort-Object)) {
  $comp = ($ligas.GetEnumerator() | Where-Object { $_.Value -eq $co }).Key
  if (-not $primero) { [void]$sb.Append(",`n") }; $primero = $false
  [void]$sb.Append(" ${co}:[`n")
  $lista = @()
  foreach ($c in ($clubs | Where-Object { $_.domestic_competition_id -eq $comp })) {
    $n = if ($nombreClub.ContainsKey($c.club_code)) { $nombreClub[$c.club_code] } else { $c.name }
    $ps = @($grupos[$c.club_id]) | Where-Object { $_ } | Sort-Object { [double]('0' + $_.market_value_in_eur) } -Descending | Select-Object -First $PorClub
    $items = foreach ($p in $ps) {
      $po = $pos[$p.sub_position]; if (-not $po) { $po = $posGen[$p.position] }; if (-not $po) { continue }
      $edad = 25; if ($p.date_of_birth) { $d = [datetime]($p.date_of_birth.Substring(0,10)); $edad = [int][math]::Floor(($ref - $d).TotalDays / 365.25) }
      $pais = $p.country_of_citizenship; $na = if ($nat.ContainsKey($pais)) { $nat[$pais] } elseif ($es.ContainsKey($pais)) { $es[$pais] } elseif ($pais) { $pais } else { '?' }
      $v = [double]('0' + $p.market_value_in_eur); if ($v -le 0) { $v = 50000 }
      $totalJ++
      '[' + (J $p.name) + ',' + (J $po) + ',' + $edad + ',' + (J $na) + ',' + [int64]$v + ']'
    }
    $lista += '  {n:' + (J $n) + ',p:[' + ($items -join ',') + ']}'
  }
  [void]$sb.Append(($lista -join ",`n") + "`n ]")
}
[void]$sb.Append("`n},`nguests:[`n")
# clubes invitados para Europa: los más valiosos de otras ligas europeas
$inv = [ordered]@{ 'TR1'=@('Turquía',5); 'SC1'=@('Escocia',4); 'BE1'=@('Bélgica',6); 'A1'=@('Austria',4); 'GR1'=@('Grecia',4); 'C1'=@('Suiza',4); 'TS1'=@('Chequia',3);
  'DK1'=@('Dinamarca',3); 'NO1'=@('Noruega',2); 'SE1'=@('Suecia',3); 'KR1'=@('Croacia',3); 'SER1'=@('Serbia',2); 'UKR1'=@('Ucrania',2); 'PL1'=@('Polonia',3); 'RO1'=@('Rumanía',2) }
$clubsAll = Import-Csv (Join-Path $Datos 'clubs.csv') -Encoding UTF8 | Where-Object { $_.last_season -eq $Temporada -and $inv.Contains($_.domestic_competition_id) }
$jugInv = Import-Csv (Join-Path $Datos 'players.csv') -Encoding UTF8 | Where-Object { $_.last_season -eq $Temporada -and $inv.Contains($_.current_club_domestic_competition_id) }
$gInv = $jugInv | Group-Object current_club_id -AsHashTable -AsString
$gl = @()
$corto = @{ 'Beşiktaş Jimnastik Kulübü'='Beşiktaş'; 'Fenerbahce'='Fenerbahçe'; 'Fußballclub Red Bull Salzburg'='Red Bull Salzburg'; 'Sportklub Puntigamer Sturm Graz'='Sturm Graz';
  'Olympiakos Syndesmos Filathlon Peiraios'='Olympiacos'; 'Panathinaikos Athlitikos Omilos'='Panathinaikos'; 'Athlitiki Enosi Konstantinoupoleos'='AEK Atenas';
  'Panthessalonikios Athlitikos Omilos Konstantinoupoliton'='PAOK'; 'Fotballklubben Bodø/Glimt'='Bodø/Glimt'; 'Viking Fotballklubb'='Viking FK';
  'Malmö Fotbollförening'='Malmö FF'; 'Mjällby Almänna Idrottsförening'='Mjällby AIF'; 'Red Star Belgrade'='Estrella Roja'; 'FC Copenhagen'='FC Copenhague' }
foreach ($comp in $inv.Keys) {
  $pais = $inv[$comp][0]; $num = $inv[$comp][1]
  $cands = $clubsAll | Where-Object { $_.domestic_competition_id -eq $comp } | ForEach-Object {
    $ps = @($gInv[$_.club_id]) | Where-Object { $_ }; $tot = ($ps | Measure-Object -Property market_value_in_eur -Sum).Sum
    [pscustomobject]@{ c = $_; ps = $ps; tot = [double]$tot } } | Sort-Object tot -Descending | Select-Object -First $num
  foreach ($x in $cands) {
    $ps = $x.ps | Sort-Object { [double]('0' + $_.market_value_in_eur) } -Descending | Select-Object -First 22
    $items = foreach ($p in $ps) {
      $po = $pos[$p.sub_position]; if (-not $po) { $po = $posGen[$p.position] }; if (-not $po) { continue }
      $edad = 25; if ($p.date_of_birth) { $d = [datetime]($p.date_of_birth.Substring(0,10)); $edad = [int][math]::Floor(($ref - $d).TotalDays / 365.25) }
      $pc = $p.country_of_citizenship; $na = if ($nat.ContainsKey($pc)) { $nat[$pc] } elseif ($es.ContainsKey($pc)) { $es[$pc] } elseif ($pc) { $pc } else { '?' }
      $v = [double]('0' + $p.market_value_in_eur); if ($v -le 0) { $v = 50000 }; $totalJ++
      '[' + (J $p.name) + ',' + (J $po) + ',' + $edad + ',' + (J $na) + ',' + [int64]$v + ']' }
    $nm = $x.c.name; if ($corto.ContainsKey($nm)) { $nm = $corto[$nm] }
    $gl += '  {n:' + (J $nm) + ',co:' + (J $pais) + ',p:[' + ($items -join ',') + ']}'
  }
}
[void]$sb.Append(($gl -join ",`n") + "`n]};`n")
Write-Host ("Invitados para Europa: {0} clubes" -f $gl.Count)
[IO.File]::WriteAllText($Salida, $sb.ToString(), (New-Object Text.UTF8Encoding $false))
Write-Host ("Hecho: {0} clubes y {1} jugadores en {2} ({3} KB)" -f $clubs.Count, $totalJ, $Salida, [math]::Round((Get-Item $Salida).Length/1KB))
