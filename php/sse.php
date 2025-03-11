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

    $ultima_actualizacion = $cache->get('ultima_actualizacion');

if (!$ultima_actualizacion) {
    $stmt = $conn->query("SELECT MAX(ultima_actualizacion) FROM muelles");
    $ultima_actualizacion = $stmt->fetchColumn();
    $cache->set('ultima_actualizacion', $ultima_actualizacion, 2);
}

// Bucle principal optimizado
while(true) {
    $nueva_actualizacion = $cache->get('ultima_actualizacion');
    
    if($nueva_actualizacion != $ultima_actualizacion) {
        $data = $cache->get('muelles_data');
        echo "data: " . json_encode($data) . "\n\n";
        ob_flush();
        flush();
        $ultima_actualizacion = $nueva_actualizacion;
    }
    
    sleep(3); // Aumentar intervalo
}
} catch(PDOException $e) {
    error_log("Error SSE: " . $e->getMessage());
    echo "event: error\ndata: " . json_encode(['error' => 'Database error']) . "\n\n";
}
?>