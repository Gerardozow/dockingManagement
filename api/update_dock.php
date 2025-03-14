<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Rechazar solicitudes que no sean POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Método no permitido
    echo json_encode(['error' => 'Método no permitido. Use POST.']);
    exit();
}

require_once '../includes/database.php';
require_once '../includes/auth.php';
require_once '../includes/helpers.php';

checkAuth();

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $dockId = $_GET['id'];

    if (!is_numeric($dockId)) {
        throw new Exception('ID de dock inválido');
    }

    $query = "UPDATE docks SET
        client_name = ?,
        details = ?,
        status = ?,
        start_time = IF(? = 'ocupado', NOW(), start_time),
        end_time = IF(? = 'disponible', NOW(), end_time)
        WHERE id = ?";

    $stmt = $conn->prepare($query);
    $stmt->bind_param('sssssi',
        $data['client_name'],
        $data['details'],
        $data['status'],
        $data['status'],
        $data['status'],
        $dockId
    );

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        throw new Exception('Error al actualizar: ' . $stmt->error);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>