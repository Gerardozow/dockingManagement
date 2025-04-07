<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Establecer la zona horaria de México
date_default_timezone_set('America/Mexico_City');

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

    // Validar datos requeridos (solo el estado es obligatorio)
    if (empty($data['status'])) {
        throw new Exception('El estado es obligatorio');
    }

    // Obtener la hora actual en la zona horaria de México
    $currentTime = date('Y-m-d H:i:s'); // Formato compatible con MySQL

    // Lógica para limpiar campos si el nuevo estado es "disponible"
    $isDisponible = strtolower($data['status']) === 'disponible';

    $clientName = $isDisponible ? '' : ($data['client_name'] ?? '');
    $details = $isDisponible ? '' : ($data['details'] ?? '');

    // Actualizar tiempos automáticamente
    $startTime = ($data['status'] === 'ocupado') ? $currentTime : 'start_time';
    $endTime = ($data['status'] === 'disponible') ? $currentTime : 'end_time';

    // Construir consulta SQL
    $query = "UPDATE docks SET
        client_name = ?,
        details = ?,
        status = ?,
        start_time = ?,
        end_time = ?
        WHERE id = ?";

    $stmt = $conn->prepare($query);
    if (!$stmt) {
        throw new Exception('Error al preparar la consulta: ' . $conn->error);
    }

    // Ejecutar consulta
    $stmt->bind_param('sssssi',
        $clientName, // Vacío si está disponible
        $details,    // Vacío si está disponible
        $data['status'],
        $startTime,
        $endTime,
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
