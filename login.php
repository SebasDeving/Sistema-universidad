<?php
session_start();
include 'db.php';

$conn = getConnection(); // Asegurar la conexión a la base de datos

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $cedula = $_POST["cedula_admin"];
    $password = $_POST["password_admin"];

    // Consultar la base de datos
    $sql = "SELECT id, password_admin FROM usuarios_admin WHERE cedula_admin = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $cedula);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        $id = $row["id"];
        $stored_password = $row["password_admin"];

        // Si la contraseña está en texto plano, cifrarla y actualizar la base de datos
        if (!password_get_info($stored_password)['algo']) {
            $hashed_password = password_hash($stored_password, PASSWORD_DEFAULT);
            $update_sql = "UPDATE usuarios_admin SET password_admin = ? WHERE id = ?";
            $update_stmt = $conn->prepare($update_sql);
            $update_stmt->bind_param("si", $hashed_password, $id);
            $update_stmt->execute();
            $stored_password = $hashed_password; // Usar la nueva contraseña cifrada
        }

        // Verificar la contraseña cifrada
        if (password_verify($password, $stored_password)) {
            $_SESSION["admin"] = $cedula;
            header("Location: panel-admin.html"); // Redirigir al panel de administración
            exit();
        } else {
            echo "<script>alert('Contraseña incorrecta'); window.location.href='Index.html';</script>";
        }
    } else {
        echo "<script>alert('Cédula no registrada'); window.location.href='Index.html';</script>";
    }

    $stmt->close();
}

$conn->close();
?>