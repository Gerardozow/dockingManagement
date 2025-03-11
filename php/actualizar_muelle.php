<?php
require_once 'conexion.php';

$data = json_decode(file_get_contents('php://input'), true);

try {
    $sql = "UPDATE muelles SET 
            estado = :estado,
            cliente_asignado = IF(:estado = 'ocupado', :cliente, NULL),
            detalles = IF(:estado = 'ocupado', :detalles, NULL),
            hora_entrada = IF(:estado = 'ocupado', NOW(), NULL),
            ultima_actualizacion = NOW()
            WHERE id = :id";
            
    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':id' => $data['id'],
        ':estado' => $data['estado'],
        ':cliente' => $data['cliente'] ?? null,
        ':detalles' => $data['detalles'] ?? null
    ]);
    
    echo json_encode(['success' => true]);
    
} catch(PDOException $e) {
    error_log("Error actualizar_muelle: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al actualizar el muelle'
    ]);
}
?>