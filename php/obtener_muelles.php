<?php
// php/obtener_muelles.php
require 'conexion.php';

try {
    $stmt = $conn->query("SELECT 
        id,
        nombre,
        estado,
        cliente_asignado,
        detalles,
        DATE_FORMAT(hora_entrada, '%Y-%m-%d %H:%i:%s') as hora_entrada,
        UNIX_TIMESTAMP(ultima_actualizacion) as ultima_actualizacion
        FROM muelles");
    
    $muelles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $muelles,
        'timestamp' => time()
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Error en la consulta: ' . $e->getMessage()
    ]);
}
?>