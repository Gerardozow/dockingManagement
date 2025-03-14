<?php
require_once '../includes/database.php';
require_once '../includes/auth.php';
require_once '../includes/helpers.php';

checkAuth();
$userRole = $_SESSION['role'];

$data = json_decode(file_get_contents('php://input'), true);
$dockId = $_GET['id'];

// Validaciones para admin
// En la validación del nombre:
if ($userRole === 'admin') {
    $name = trim($data['name'] ?? '');
    
    if (empty($name)) {
        http_response_code(400);
        echo json_encode(['error' => 'El nombre no puede estar vacío']);
        exit();
    }
    
    if (strlen($name) > 100) {
        http_response_code(400);
        echo json_encode(['error' => 'El nombre debe tener menos de 100 caracteres']);
        exit();
    }
} else {
    unset($data['name']);
    if ($data['status'] === 'cerrado') {
        http_response_code(403);
        echo json_encode(['error' => 'Solo administradores pueden cerrar docks']);
        exit();
    }
}

// Actualización condicional de tiempos
$startTime = ($data['status'] === 'ocupado') ? 'NOW()' : 'start_time';
$endTime = ($data['status'] === 'disponible') ? 'NOW()' : 'end_time';

$query = "UPDATE docks SET
    name = ?,
    client_name = ?,
    details = ?,
    status = ?,
    start_time = $startTime,
    end_time = $endTime
WHERE id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param('ssssi',
    $data['name'] ?? null,
    $data['client_name'],
    $data['details'],
    $data['status'],
    $dockId
);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al actualizar: ' . $conn->error]);
}
?>