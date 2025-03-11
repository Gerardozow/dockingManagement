<?php
require 'config.php';

$input = json_decode(file_get_contents('php://input'), true);

try {
    $conn = Database::getConnection();
    
    if ($input['estado'] === 'ocupado' && empty($input['cliente'])) {
        throw new Exception('El cliente es requerido para estado ocupado');
    }

    $stmt = $conn->prepare("UPDATE muelles SET
        estado = :estado,
        cliente_asignado = :cliente,
        detalles = :detalles,
        hora_entrada = IF(:estado = 'ocupado', NOW(), NULL),
        ultima_actualizacion = NOW()
        WHERE id = :id");
        
    $stmt->execute([
        ':id' => $input['id'],
        ':estado' => $input['estado'],
        ':cliente' => $input['estado'] === 'ocupado' ? $input['cliente'] : null,
        ':detalles' => $input['estado'] === 'ocupado' ? $input['detalles'] : null
    ]);
    
    echo json_encode(['success' => true]);
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>