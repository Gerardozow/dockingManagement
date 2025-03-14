<?php if (isset($_SESSION['user_id'])): ?>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
        <a class="navbar-brand" href="#">
            <i class="bi bi-box-seam"></i> Gestión Docks
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <div class="navbar-nav ms-auto">
                <?php if (getUserRole() === 'admin'): ?>
                <span class="nav-item me-3 text-warning">
                    <i class="bi bi-shield-lock"></i> Admin
                </span>
                <?php endif; ?>
                <a class="nav-link" href="logout.php">
                    <i class="bi bi-box-arrow-right"></i>
                    <span class="d-lg-none">Salir</span>
                </a>
            </div>
        </div>
    </div>
</nav>
<?php endif; ?>