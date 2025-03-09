<?php
include 'db.php';

$conn = getConnection();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $cedula = $_POST['cedula_estudiantes'];

    // Preparar y ejecutar la consulta
    $stmt = $conn->prepare("SELECT * FROM estudiantes WHERE cedula_estudiantes = ?");
    $stmt->bind_param("i", $cedula);
    $stmt->execute();
    $result = $stmt->get_result();

    // Verificar si se encontró la cédula
    if ($result->num_rows > 0) {
        // Redirigir a Estudiantes.html
        header("Location: Estudiantes.html");
        exit();
    } else {
        // Manejar el caso en que la cédula no es válida
        echo "<div class='error-message' style='color: red;'>Cédula no válida</div>";
    }

    // Cerrar la conexión
    $stmt->close();
    $conn->close();
}
