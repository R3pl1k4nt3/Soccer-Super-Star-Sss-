# Extrae los textos de los scripts del juego para preparar la traduccion al ingles.
# Uso: powershell -File tools\extraer-textos.ps1 -Out salida.txt
param([string]$Out='textos-es.txt')
$skip=@('datos-reales.js','escudos-reales.js','escudos.js','graficos.js','graficos-mejorados.js','avatar.js','lang-en.js')
$set=New-Object 'System.Collections.Generic.SortedSet[string]' ([StringComparer]::Ordinal)
$lit=[regex]"'((?:[^'\\\r\n]|\\.)*)'|""((?:[^""\\\r\n]|\\.)*)"""
$tag=[regex]'<[^>]*>|^[^<]*>|<[^>]*$'
$acc='[A-Za-z'+[char]0xC0+'-'+[char]0xFF+']{2}'
foreach($f in Get-ChildItem js\*.js){
 if($skip -contains $f.Name){continue}
 $t=[IO.File]::ReadAllText($f.FullName,[Text.Encoding]::UTF8)
 if($f.Name -eq 'datos.js'){ $t=[regex]::Replace($t,'var NAMES=[\s\S]*?\n(?=var )','') }
 foreach($m in $lit.Matches($t)){
  $s=if($m.Groups[1].Success){$m.Groups[1].Value}else{$m.Groups[2].Value}
  $s=$s -replace "\\'","'" -replace '\\"','"' -replace '\\n',' '
  foreach($p in $tag.Split($s)){
   $q=$p.Trim()
   if($q.Length -lt 2){continue}
   if($q -notmatch $acc){continue}
   if($q -cmatch '^[a-z0-9_\-\.]+$'){continue}
   if($q -match 'var\(--|px;|px\b|^#|https?:|\.js|\.png|\.glb|^[\w\-]+=|[{};]\s*$|^[a-z]+\([^)]*\)$|^\s*[a-z\-]+:\s*[^ ]+;'){continue}
   if($q -cmatch '^[a-z][a-zA-Z0-9]*$'){continue}
   [void]$set.Add($q)
  }
 }
}
[IO.File]::WriteAllLines((Join-Path (Get-Location) $Out),$set,(New-Object Text.UTF8Encoding($false)))
"$($set.Count) textos"
