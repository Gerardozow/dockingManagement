<?php
// create_user.php
require_once 'includes/database.php';

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    $role = $_POST['role'];

    // Validaciones básicas
    if (empty($username) || empty($password)) {
        $error = 'Usuario y contraseña son requeridos!';
    } else {
        // Verificar si el usuario ya existe
        $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        
        if ($stmt->get_result()->num_rows > 0) {
            $error = 'El usuario ya existe!';
        } else {
            // Crear usuario
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $username, $hashedPassword, $role);
            
            if ($stmt->execute()) {
                $success = 'Usuario creado exitosamente!';
            } else {
                $error = 'Error al crear el usuario: ' . $conn->error;
            }
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <title>Crear Usuario</title>
</head>
<body class="bg-light">
    <div class="container mt-5" style="max-width: 500px;">
        <div class="card shadow">
            <div class="card-body">
                <h2 class="text-center mb-4">Crear Usuario Temporal</h2>
                
                <?php if ($error): ?>
                    <div class="alert alert-danger"><?= $error ?></div>
                <?php endif; ?>
                
                <?php if ($success): ?>
                    <div class="alert alert-success"><?= $success ?></div>
                <?php endif; ?>

                <form method="POST">
                    <div class="mb-3">
                        <label class="form-label">Usuario</label>
                        <input type="text" name="username" class="form-control" required>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Contraseña</label>
                        <input type="password" name="password" class="form-control" required>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label">Rol</label>
                        <select name="role" class="form-select">
                            <option value="user">Usuario Normal</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    
                    <button type="submit" class="btn btn-primary w-100">Crear Usuario</button>
                </form>
                
                <div class="mt-3 text-center">
                    <a href="index.php" class="text-decoration-none">Volver al Login</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>