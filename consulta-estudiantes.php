<?php
session_start();
include 'db.php';

$conn = getConnection();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_POST['cedula_estudiante']) || empty($_POST['cedula_estudiante'])) {
        $_SESSION["error_message"] = "Debe ingresar una cédula";
        header("Location: index.php");
        exit();
    }

    $cedula = $_POST['cedula_estudiante'];

    // Preparar y ejecutar la consulta
    $stmt = $conn->prepare("SELECT * FROM estudiantes WHERE cedula_estudiante = ?");
    $stmt->bind_param("s", $cedula);  // Usa "s" si la cédula es un string
    $stmt->execute();
    $result = $stmt->get_result();

    // Verificar si se encontró la cédula
    if ($result->num_rows > 0) {
        header("Location: Estudiantes.html");
        exit();
    } else {
        $_SESSION["error_message"] = "Numero de cedula no encontrado";
        header("Location: index.php");
        exit();
    }

    // Cerrar la conexión
    $stmt->close();
    $conn->close();
}
?>

