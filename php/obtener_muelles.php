<?php
require_once 'conexion.php';
require_once 'funciones.php';

header('Content-Type: application/json');
echo json_encode(obtenerMuelles());