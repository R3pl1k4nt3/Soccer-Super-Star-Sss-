# Servidor local mínimo para probar el juego en http://localhost:<puerto> (no hace falta para jugar: basta con abrir index.html).
param([string]$Root='.',[int]$Port=8123)
$Root=(Resolve-Path $Root).Path
$l=New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$Port/")
$l.Start()
Write-Host "Sirviendo $Root en http://localhost:$Port/"
$types=@{'.html'='text/html; charset=utf-8';'.js'='application/javascript; charset=utf-8';'.css'='text/css';'.md'='text/plain; charset=utf-8'}
while($l.IsListening){
 $c=$l.GetContext()
 $p=[Uri]::UnescapeDataString($c.Request.Url.AbsolutePath.TrimStart('/'))
 if($p -eq ''){$p='index.html'}
 $f=Join-Path $Root $p
 if((Test-Path $f -PathType Leaf) -and ([IO.Path]::GetFullPath($f).StartsWith([IO.Path]::GetFullPath($Root)))){
  $b=[IO.File]::ReadAllBytes($f);$e=[IO.Path]::GetExtension($f)
  $c.Response.ContentType=$(if($types[$e]){$types[$e]}else{'application/octet-stream'})
  $c.Response.Headers.Add('Cache-Control','no-store')
  $c.Response.ContentLength64=$b.Length
  try{ if($c.Request.HttpMethod -ne 'HEAD'){ $c.Response.OutputStream.Write($b,0,$b.Length) } }catch{}
 } else { $c.Response.StatusCode=404 }
 $c.Response.Close()
}
