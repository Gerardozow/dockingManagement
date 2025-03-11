<?php
require 'conexion.php';

$data = json_decode(file_get_contents('php://input'), true);

try {
    if ($data['estado'] === 'ocupado' && empty($data['cliente'])) {
        throw new Exception('El cliente es requerido para estado ocupado');
    }

    $sql = "UPDATE muelles SET
            estado = :estado,
            cliente_asignado = :cliente,
            detalles = :detalles,
            hora_entrada = IF(:estado = 'ocupado', NOW(), NULL),
            ultima_actualizacion = NOW()
            WHERE id = :id";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ':id' => $data['id'],
        ':estado' => $data['estado'],
        ':cliente' => $data['estado'] === 'ocupado' ? $data['cliente'] : null,
        ':detalles' => $data['estado'] === 'ocupado' ? $data['detalles'] : null
    ]);

    echo json_encode(['success' => true]);
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>