<?php if (isset($_SESSION['user_id'])): ?>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container">
    <a class="navbar-brand" href="#">Gestión Docks</a>
    <div class="navbar-nav ms-auto">
      <span class="navbar-text me-3">Usuario: <?= $_SESSION['username'] ?? 'Invitado' ?></span>
      <a href="logout.php" class="btn btn-outline-light">Cerrar Sesión</a>
    </div>
  </div>
</nav>
<?php endif; ?>