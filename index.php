<?php session_start(); ?>
<!DOCTYPE html>
<html>
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body class="bg-light">
  <div class="container mt-5" style="max-width: 400px;">
    <div class="card shadow">
      <div class="card-body">
        <h2 class="text-center mb-4">Login</h2>
        <?php if (isset($_GET['error'])): ?>
          <div class="alert alert-danger">Credenciales incorrectas</div>
        <?php endif; ?>
        <form method="POST" action="login_check.php">
          <div class="mb-3">
            <input type="text" name="username" class="form-control" placeholder="Usuario" required>
          </div>
          <div class="mb-3">
            <input type="password" name="password" class="form-control" placeholder="Contraseña" required>
          </div>
          <button type="submit" class="btn btn-primary w-100">Ingresar</button>
        </form>
      </div>
    </div>
  </div>
</body>
</html>