<?php
require_once '../includes/database.php';
require_once '../includes/helpers.php';

header('Content-Type: application/json');

if (!isset($_GET['id'])) {
  http_response_code(400);
  echo json_encode(['error' => 'ID requerido']);
  exit();
}

$dock = getDockById($_GET['id']);
echo json_encode($dock);
?>