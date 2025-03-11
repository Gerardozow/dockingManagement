<?php
require 'conexion.php';

try {
    $stmt = $conn->query("SELECT MAX(ultima_actualizacion) as ts FROM muelles");
    $timestamp = strtotime($stmt->fetchColumn());
    
    echo json_encode([
        'success' => true,
        'timestamp' => $timestamp ?: time()
    ]);
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Error: ' . $e->getMessage()
    ]);
}