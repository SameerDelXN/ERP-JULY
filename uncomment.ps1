param([string]$path, [int]$startLine = 1)
$i = 0
(Get-Content -Path $path) | ForEach-Object { 
    $i++
    if ($i -ge $startLine) { 
        $_ -replace '^(\s*)// ?', '$1' 
    } else { 
        $_ 
    } 
} | Set-Content -Path $path
