<?php
session_start();

function checkAuth() {
  if (!isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit();
  }
}

function getUser($username, $password) {
  global $conn;
  $stmt = $conn->prepare("SELECT * FROM users WHERE username = ?");
  $stmt->bind_param("s", $username);
  $stmt->execute();
  $user = $stmt->get_result()->fetch_assoc();
  
  return ($user && password_verify($password, $user['password'])) ? $user : null;
}
?>