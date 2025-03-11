<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
set_time_limit(0); // Eliminar límite de tiempo de ejecución

require_once 'conexion.php';
require_once 'funciones.php';

function getUltimaActualizacion() {
    global $conn;
    $result = $conn->query("SELECT MAX(ultima_actualizacion) as ultima FROM muelles");
    return $result->fetch_assoc()['ultima'];
}

$ultima_actualizacion = getUltimaActualizacion();

// Enviar estado inicial inmediatamente
echo "data: " . json_encode(obtenerMuelles()) . "\n\n";
ob_flush();
flush();

while(true) {
    $nueva_actualizacion = getUltimaActualizacion();
    
    if($nueva_actualizacion != $ultima_actualizacion) {
        $ultima_actualizacion = $nueva_actualizacion;
        echo "data: " . json_encode(obtenerMuelles()) . "\n\n";
        ob_flush();
        flush();
    }
    
    sleep(1); // Verificar cada segundo
}
?>