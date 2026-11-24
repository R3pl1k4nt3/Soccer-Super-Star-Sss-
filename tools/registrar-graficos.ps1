# Registra los gráficos nuevos de diseno/entregas para la versión «Mejorados» del juego.
# Uso (desde la carpeta del juego), cada vez que añadas o cambies gráficos:
#   powershell -ExecutionPolicy Bypass -File tools\registrar-graficos.ps1
# Crea js/graficos-mejorados.js: los SVG se guardan dentro (así se pueden recolorear y funcionan sin servidor)
# y las imágenes PNG, JPG o WEBP se guardan como ruta.
param([string]$Juego = (Join-Path $PSScriptRoot '..'))
$ErrorActionPreference = 'Stop'
$base = (Resolve-Path (Join-Path $Juego 'diseno\entregas')).Path
$svg = [ordered]@{}; $img = [ordered]@{}
function J([string]$s){ return '"' + ($s -replace '\\','\\' -replace '"','\"' -replace "`r",'' -replace "`n",'\n') + '"' }
Get-ChildItem $base -Recurse -File | Where-Object { $_.Extension -match '^\.(svg|png|jpe?g|webp)$' } | ForEach-Object {
  $rel = $_.FullName.Substring($base.Length + 1) -replace '\\','/'
  $key = ($rel -replace '\.[^.]+$','').ToLower()
  if ($_.Extension -eq '.svg') {
    $t = [IO.File]::ReadAllText($_.FullName)
    $t = $t -replace '<\?xml[^>]*\?>','' -replace '<!DOCTYPE[^>]*>','' -replace '<!--[\s\S]*?-->',''
    $svg[$key] = $t.Trim()
  } else { $img[$key] = 'diseno/entregas/' + $rel }
}
$out = "/* Generado por tools/registrar-graficos.ps1. No editar a mano: vuelve a ejecutar el script. */`nvar GFX={svg:{`n" +
  (($svg.Keys | ForEach-Object { (J $_) + ':' + (J $svg[$_]) }) -join ",`n") + "`n},img:{`n" +
  (($img.Keys | ForEach-Object { (J $_) + ':' + (J $img[$_]) }) -join ",`n") + "`n}};`n"
[IO.File]::WriteAllText((Join-Path $Juego 'js\graficos-mejorados.js'), $out, (New-Object Text.UTF8Encoding $false))
Write-Host ("Registrados {0} SVG y {1} imágenes en js/graficos-mejorados.js" -f $svg.Count, $img.Count)
$porCarpeta = @($svg.Keys) + @($img.Keys) | Group-Object { $_.Split('/')[0] } | ForEach-Object { "  {0}: {1}" -f $_.Name, $_.Count }
$porCarpeta | ForEach-Object { Write-Host $_ }
