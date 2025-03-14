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
    // Consulta para obtener todos los docks agrupados por área
    $query = "SELECT id, name, type, status, client_name, start_time, end_time, details FROM docks ORDER BY type, id";
    $result = $conn->query($query);

    if (!$result) {
        throw new Exception('Error al ejecutar la consulta: ' . $conn->error);
    }

    $docks = $result->fetch_all(MYSQLI_ASSOC);

    // Agrupar docks por área
    $groupedDocks = [
        'recibo' => [],
        'embarque' => [],
        'exterior' => []
    ];

    foreach ($docks as $dock) {
        $groupedDocks[$dock['type']][] = $dock;
    }

    echo json_encode($groupedDocks);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>