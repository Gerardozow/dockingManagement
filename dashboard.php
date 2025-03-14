<?php
require_once 'includes/auth.php';
require_once 'includes/database.php';
require_once 'includes/helpers.php';

checkAuth();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Docks</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css">
    <!-- Estilos personalizados -->
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <?php include 'includes/navbar.php'; ?>
    
    <div class=".container-fluid mt-3">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h4 mb-0">Gestión de Docks</h1>
            <?php if (getUserRole() === 'admin'): ?>
                <span class="badge bg-danger">ADMINISTRADOR</span>
            <?php endif; ?>
        </div>
        
        <!-- Contenedor para los docks -->
        <div id="docks-container"></div>
    </div>

    <!-- Modal de Edición -->
    <div class="modal fade" id="editModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Dock</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="editForm">
                        <div class="mb-3">
                            <label class="form-label">Nombre del Dock</label>
                            <input type="text" class="form-control" id="editDockName" readonly>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Cliente</label>
                            <input type="text" class="form-control" id="editClientName">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Estado</label>
                            <select class="form-select" id="editStatus">
                                <option value="disponible">Disponible</option>
                                <option value="ocupado">Ocupado</option>
                                <option value="cerrado">Cerrado</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Detalles</label>
                            <textarea class="form-control" id="editDetails" rows="3"></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="saveChanges">Guardar</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS y dependencias -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Scripts personalizados -->
    <script src="js/scripts.js"></script>
</body>
</html>