<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

require_once '../includes/database.php';
require_once '../includes/helpers.php';
require_once '../includes/auth.php';

checkAuth();

try {
    // Validar ID del dock
    $dockId = $_GET['id'] ?? null;
    if (!is_numeric($dockId)) {
        throw new Exception('ID de dock inválido');
    }

    // Consulta para obtener la información del dock
    $query = "SELECT id, name, type, status, client_name, start_time, end_time, details FROM docks WHERE id = ?";
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        throw new Exception('Error al preparar la consulta: ' . $conn->error);
    }

    $stmt->bind_param('i', $dockId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        throw new Exception('Dock no encontrado');
    }

    $dock = $result->fetch_assoc();
    echo json_encode($dock);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>