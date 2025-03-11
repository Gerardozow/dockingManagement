<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

class Database {
    private static $instance = null;
    
    public static function getConnection() {
        if (!self::$instance) {
            try {
                self::$instance = new PDO(
                    'mysql:host=localhost;dbname=tu_bd;charset=utf8mb4',
                    'tu_usuario',
                    'tu_contraseña',
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                        PDO::ATTR_EMULATE_PREPARES => false
                    ]
                );
            } catch(PDOException $e) {
                die(json_encode([
                    'success' => false,
                    'error' => 'Error de conexión: ' . $e->getMessage()
                ]));
            }
        }
        return self::$instance;
    }
}
?>