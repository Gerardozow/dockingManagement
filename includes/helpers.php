<?php
function getAllDocks() {
  global $conn;
  $result = $conn->query("SELECT * FROM docks ORDER BY id");
  return $result->fetch_all(MYSQLI_ASSOC);
}

function getDockById($id) {
  global $conn;
  $stmt = $conn->prepare("SELECT * FROM docks WHERE id = ?");
  $stmt->bind_param("i", $id);
  $stmt->execute();
  return $stmt->get_result()->fetch_assoc();
}

function getStatusColor($status) {
  switch ($status) {
    case 'ocupado': return 'danger';
    case 'disponible': return 'success';
    case 'cerrado': return 'secondary';
    default: return 'light';
  }
}

function getUserRole() {
  return $_SESSION['role'] ?? null;
}

function checkAdmin() {
  if ($_SESSION['role'] !== 'admin') {
    header('HTTP/1.1 403 Forbidden');
    die('Acceso no autorizado');
  }
}
?>