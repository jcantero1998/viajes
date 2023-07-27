# Ruta del directorio raíz que contiene las carpetas con las imágenes
$directorioRaiz = ".\src\assets\images\"

# Función recursiva para obtener las imágenes de una carpeta
function ObtenerImagenes($carpeta) {
    $imagenes = @()
    $archivos = Get-ChildItem -Path $carpeta -File -Filter "*.jpg"
    foreach ($archivo in $archivos) {
        $imagenes += $archivo.Name
    }
    return $imagenes
}

# Función para guardar el contenido en formato JSON en un archivo "index.json" en la carpeta dada
function GuardarJsonEnCarpeta($contenido, $carpeta) {
    $jsonPath = Join-Path $carpeta "index.json"
    $contenido | ConvertTo-Json -Depth 1 | Out-File -FilePath $jsonPath
}

# Recorre todas las carpetas y genera el JSON
function RecorrerCarpetas($ruta) {
    $carpetas = Get-ChildItem -Path $ruta -Directory
    foreach ($carpeta in $carpetas) {
        $nombreCarpeta = $carpeta.Name
        $imagenes = ObtenerImagenes $carpeta.FullName
        GuardarJsonEnCarpeta $imagenes $carpeta.FullName
    }
}

# Ejecuta la función
RecorrerCarpetas $directorioRaiz

Write-Host "Se han generado los archivos JSON en cada carpeta que contiene imágenes."
