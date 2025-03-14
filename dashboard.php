<?php
require_once 'includes/auth.php';
require_once 'includes/database.php';
require_once 'includes/helpers.php';

checkAuth();
?>
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <?php include 'includes/navbar.php'; ?>
    
    <div class="container mt-3">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h4 mb-0">Gestión de Docks</h1>
            <?php if (getUserRole() === 'admin'): ?>
                <span class="badge bg-danger">ADMINISTRADOR</span>
            <?php endif; ?>
        </div>
        
        <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xxl-4 g-2" id="docks-container">
            <?php foreach (getAllDocks() as $dock): ?>
                <div class="col">
                    <div class="card h-100 shadow-sm border-<?= getStatusColor($dock['status']) ?>">
                        <div class="card-header py-2 bg-<?= getStatusColor($dock['status']) ?> text-white">
                            <div class="d-flex justify-content-between">
                                <div class="fw-bold">
                                    <?= htmlspecialchars($dock['name']) ?>
                                </div>
                                <small><?= strtoupper($dock['type']) ?></small>
                            </div>
                        </div>
                        <div class="card-body">
                            <ul class="list-unstyled mb-0">
                                <li><strong>Estado:</strong> <?= ucfirst($dock['status']) ?></li>
                                <li><strong>Cliente:</strong> <?= $dock['client_name'] ?: 'N/A' ?></li>
                                <li><small>Inicio: <?= $dock['start_time'] ? date('H:i', strtotime($dock['start_time'])) : '--:--' ?></small></li>
                            </ul>
                        </div>
                        <div class="card-footer bg-transparent py-2">
                            <button class="btn btn-outline-primary btn-sm w-100" 
                                    onclick="openEditModal(<?= $dock['id'] ?>)">
                                <i class="bi bi-pencil"></i> Editar
                            </button>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Modal de Edición -->
    <div class="modal fade" id="editModal">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar <?= htmlspecialchars($dock['name']) ?></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="editForm">
                        <?php if (getUserRole() === 'admin'): ?>
                        <div class="mb-3">
                            <label class="form-label">Nombre del Dock</label>
                            <input type="text" class="form-control" id="editDockName" required>
                        </div>
                        <?php endif; ?>
                        
                        <div class="mb-3">
                            <label class="form-label">Cliente</label>
                            <input type="text" class="form-control" id="editClientName">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label">Estado</label>
                            <select class="form-select" id="editStatus">
                                <option value="disponible">Disponible</option>
                                <option value="ocupado">Ocupado</option>
                                <?php if (getUserRole() === 'admin'): ?>
                                <option value="cerrado">Cerrado</option>
                                <?php endif; ?>
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

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/scripts.js"></script>
</body>
</html>