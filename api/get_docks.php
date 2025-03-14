<?php
require_once '../includes/database.php';
require_once '../includes/helpers.php';

header('Content-Type: application/json');
echo json_encode(getAllDocks());
?>