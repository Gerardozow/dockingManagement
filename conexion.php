<?php // conexion.php
$servername = "localhost";
$username = "usuario";
$password = "contraseña";
$dbname = "almacen";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

