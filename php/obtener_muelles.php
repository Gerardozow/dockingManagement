<?php
require_once 'conexion.php';

try {
    $stmt = $conn->query("SELECT * FROM muelles");
    $muelles = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'data' => $muelles
    ]);
    
} catch(PDOException $e) {
    error_log("Error obtener_muelles: " . $e->getMessage());
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error al obtener los muelles'
    ]);
}
?>