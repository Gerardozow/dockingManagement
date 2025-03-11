<?php
// funciones.php
function obtenerMuelles() {
    global $conn;
    $sql = "SELECT * FROM muelles";
    $result = $conn->query($sql);
    return $result->fetch_all(MYSQLI_ASSOC);
}

function actualizarEstadoMuelle($id, $estado, $cliente = null) {
    global $conn;
    $sql = $conn->prepare("UPDATE muelles SET estado = ?, cliente_asignado = ?, hora_entrada = NOW() WHERE id = ?");
    $sql->bind_param("ssi", $estado, $cliente, $id);
    return $sql->execute();
}