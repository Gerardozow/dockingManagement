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
require_once '../includes/helpers.php';
require_once '../includes/auth.php';

checkAuth();

try {
    // Obtener datos del cuerpo de la solicitud
    $json = file_get_contents('php://input');
    if (empty($json)) {
        throw new Exception('El cuerpo de la solicitud está vacío');
    }

    $data = json_decode($json, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Error al decodificar JSON: ' . json_last_error_msg());
    }

    // Validar ID del dock
    $dockId = $_GET['id'] ?? null;
    if (!is_numeric($dockId)) {
        throw new Exception('ID de dock inválido');
    }

    // Validar datos requeridos
    if (empty($data['client_name']) || empty($data['status']) || empty($data['details'])) {
        throw new Exception('Datos incompletos');
    }

    // Actualizar tiempos automáticamente
    $startTime = ($data['status'] === 'ocupado') ? 'NOW()' : 'start_time';
    $endTime = ($data['status'] === 'disponible') ? 'NOW()' : 'end_time';

    // Construir consulta SQL
    $query = "UPDATE docks SET
        client_name = ?,
        details = ?,
        status = ?,
        start_time = $startTime,
        end_time = $endTime
        WHERE id = ?";

    $stmt = $conn->prepare($query);
    if (!$stmt) {
        throw new Exception('Error al preparar la consulta: ' . $conn->error);
    }

    // Ejecutar consulta
    $stmt->bind_param('sssi',
        $data['client_name'],
        $data['details'],
        $data['status'],
        $dockId
    );

    if (!$stmt->execute()) {
        throw new Exception('Error al ejecutar la consulta: ' . $stmt->error);
    }

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>