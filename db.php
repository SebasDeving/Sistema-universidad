<?php
function getConnection() {
    $host = 'localhost'; // Cambia esto si es necesario
    $dbname = 'pruebas_pro'; // Nombre de tu base de datos
    $user = 'root'; // Tu usuario de base de datos
    $password = ''; // Tu contraseña de base de datos

    $conn = new mysqli($host, $user, $password, $dbname);

    // Verificar conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    return $conn;
}

