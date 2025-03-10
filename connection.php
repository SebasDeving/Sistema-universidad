<?php
class Connection
{
    private static $connection = null;
    private static $host = 'localhost:3306'; // Cambia esto si es necesario
    private static $dbname = 'pruebas_pro'; // Nombre de tu base de datos
    private static $user = 'root'; // Usuario de la base de datos
    private static $password = ''; // Contraseña de tu base de datos

    // Constructor privado para evitar instanciación directa
    private function __construct()
    {
    }

    public static function getConnection()
    {
        if (self::$connection === null) {
            self::$connection = new mysqli(self::$host, self::$user, self::$password, self::$dbname);

            // Verificar conexión
            if (self::$connection->connect_error) {
                die("Conexión fallida: " . self::$connection->connect_error);
            }
        }

        return self::$connection;
    }
}
?>