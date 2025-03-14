<?php
require_once '../includes/database.php';
require_once '../includes/auth.php';
require_once '../includes/helpers.php';

checkAuth();
header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);
    $dockId = $_GET['id'];
    $userRole = $_SESSION['role'];

    // Validación del ID del dock
    if (!is_numeric($dockId)) {
        throw new Exception('ID de dock inválido');
    }

    // Validación para administradores
    if ($userRole === 'admin') {
        if (!isset($data['name']) || empty(trim($data['name']))) {
            throw new Exception('El nombre del dock es obligatorio');
        }
        
        if (strlen(trim($data['name'])) > 100) {
            throw new Exception('El nombre no puede exceder 100 caracteres');
        }
    }

    // Construir la consulta dinámicamente
    $updates = [];
    $params = [];
    $types = '';

    if ($userRole === 'admin') {
        $updates[] = 'name = ?';
        $params[] = trim($data['name']);
        $types .= 's';
    }

    $updates[] = 'client_name = ?';
    $params[] = trim($data['client_name'] ?? '');
    $types .= 's';

    $updates[] = 'details = ?';
    $params[] = trim($data['details'] ?? '');
    $types .= 's';

    $updates[] = 'status = ?';
    $params[] = $data['status'];
    $types .= 's';

    // Manejo de tiempos
    $startTime = ($data['status'] === 'ocupado') ? 'NOW()' : 'start_time';
    $endTime = ($data['status'] === 'disponible') ? 'NOW()' : 'end_time';
    
    $query = "UPDATE docks SET 
        " . implode(', ', $updates) . ",
        start_time = $startTime,
        end_time = $endTime
        WHERE id = ?";
    
    $params[] = $dockId;
    $types .= 'i';

    // Ejecutar consulta
    $stmt = $conn->prepare($query);
    $stmt->bind_param($types, ...$params);

    if (!$stmt->execute()) {
        throw new Exception('Error en la base de datos: ' . $stmt->error);
    }

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}