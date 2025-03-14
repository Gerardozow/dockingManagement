<?php
session_start();
include 'includes/database.php';
include 'includes/auth.php';

$username = $_POST['username'];
$password = $_POST['password'];

$user = getUser($username, $password); // Función en auth.php

if ($user) {
  $_SESSION['user_id'] = $user['id'];
  $_SESSION['role'] = $user['role'];
  header('Location: dashboard.php');
} else {
  header('Location: index.php?error=1');
}