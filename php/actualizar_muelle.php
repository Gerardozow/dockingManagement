<?php
require_once 'conexion.php';
require_once 'funciones.php';

$data = json_decode(file_get_contents('php://input'), true);
actualizarEstadoMuelle($data['id'], $data['estado'], $data['cliente']);
echo json_encode(['success' => true]);