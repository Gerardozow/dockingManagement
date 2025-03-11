<?php
// sse.php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
ob_implicit_flush(true); // Importante para el flujo de datos

require_once 'conexion.php';

try {
    function getUltimaActualizacion($conn) {
        $stmt = $conn->query("SELECT MAX(ultima_actualizacion) as ultima FROM muelles");
        return $stmt->fetchColumn() ?: date('Y-m-d H:i:s');
    }

    // Obtener todos los muelles
    function obtenerMuelles($conn) {
        $stmt = $conn->query("SELECT * FROM muelles");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    $ultima_actualizacion = getUltimaActualizacion($conn);
    
    // Enviar datos iniciales
    echo "data: " . json_encode(obtenerMuelles($conn)) . "\n\n";
    ob_flush();
    flush();

    // Bucle principal
    while(true) {
        $nueva_actualizacion = getUltimaActualizacion($conn);
        
        if($nueva_actualizacion != $ultima_actualizacion) {
            $ultima_actualizacion = $nueva_actualizacion;
            echo "data: " . json_encode(obtenerMuelles($conn)) . "\n\n";
            ob_flush();
            flush();
        }
        
        sleep(1);
    }
} catch(PDOException $e) {
    error_log("Error SSE: " . $e->getMessage());
    echo "event: error\ndata: " . json_encode(['error' => 'Database error']) . "\n\n";
}
?>