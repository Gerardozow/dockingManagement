<?php
require_once 'includes/auth.php';
require_once 'includes/database.php';
require_once 'includes/helpers.php';

checkAuth();
?>
<!DOCTYPE html>
<html>
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <?php include 'includes/navbar.php'; ?>
  
  <div class="container mt-4">
    <h1 class="text-center mb-4">Gestión de Docks</h1>
    <div class="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4" id="docks-container">
      <?php foreach (getAllDocks() as $dock): ?>
        <div class="col">
          <div class="card h-100 border-<?= getStatusColor($dock['status']) ?>">
            <div class="card-header bg-<?= getStatusColor($dock['status']) ?> text-white">
              <h5 class="card-title mb-0">Dock #<?= $dock['id'] ?></h5>
              <small><?= ucfirst($dock['type']) ?></small>
            </div>
            <div class="card-body">
              <p class="card-text"><strong>Estado:</strong> <?= ucfirst($dock['status']) ?></p>
              <p class="card-text"><strong>Cliente:</strong> <?= $dock['client_name'] ?: 'N/A' ?></p>
            </div>
            <div class="card-footer">
              <button class="btn btn-outline-primary w-100" 
                      onclick="openEditModal(<?= $dock['id'] ?>)">
                Editar
              </button>
            </div>
          </div>
        </div>
      <?php endforeach; ?>
    </div>
  </div>

  <!-- Modal de edición -->
  <div class="modal fade" id="editModal">
    <!-- Contenido del modal aquí -->
  </div>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
  <script src="js/scripts.js"></script>
</body>
</html>