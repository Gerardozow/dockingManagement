<?php
require_once '../includes/database.php';
require_once '../includes/helpers.php';
require_once '../includes/auth.php';

checkAuth();

$data = json_decode(file_get_contents('php://input'), true);
$dockId = $_GET['id'];

// Actualizar tiempos automáticamente
$startTime = ($data['status'] === 'ocupado') ? 'NOW()' : 'start_time';
$endTime = ($data['status'] === 'disponible') ? 'NOW()' : 'end_time';

$query = "UPDATE docks SET
  client_name = ?,
  details = ?,
  status = ?,
  start_time = $startTime,
  end_time = $endTime
WHERE id = ?";

$stmt = $conn->prepare($query);
$stmt->bind_param(
  'sssi',
  $data['client_name'],
  $data['details'],
  $data['status'],
  $dockId
);

if ($stmt->execute()) {
  echo json_encode(['success' => true]);
} else {
  http_response_code(500);
  echo json_encode(['error' => 'Error al actualizar']);
}
?>