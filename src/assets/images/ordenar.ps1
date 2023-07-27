$directorioPadre = 'C:\Users\jcantero\Desktop\Nueva carpeta\gallery\src\assets\images'
$directorios = Get-ChildItem -Path $directorioPadre -Directory | ForEach-Object { $_.Name }

foreach ($directorio in $directorios) {
    $rutaDirectorio = Join-Path -Path $directorioPadre -ChildPath $directorio
    $imagenes = Get-ChildItem -Path $rutaDirectorio | Where-Object { $_.Extension -match '\.(jpg|png|gif|jpeg)$' } | Sort-Object CreationTime

    for ($i = 0; $i -lt $imagenes.Count; $i++) {
        $extension = $imagenes[$i].Extension
        $nuevoNombre = "$i$extension"
        $rutaNueva = Join-Path -Path $rutaDirectorio -ChildPath $nuevoNombre

        # Verificar si el nombre de archivo ya existe y aumentarlo en caso afirmativo
        $contador = 0
        while (Test-Path -Path $rutaNueva) {
            $nuevoNombre = "$($contador)$extension"
            $rutaNueva = Join-Path -Path $rutaDirectorio -ChildPath $nuevoNombre
            $contador++
        }

        Rename-Item -Path $imagenes[$i].FullName -NewName $rutaNueva
    }
}
