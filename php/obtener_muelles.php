<?php
require 'config.php';

try {
    $conn = Database::getConnection();
    $stmt = $conn->query("SELECT * FROM muelles");
    $data = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true,
        'data' => $data
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>