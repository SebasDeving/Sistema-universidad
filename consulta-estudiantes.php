<?php
session_start();
require_once('crud_estudiante.php');
$crud = new CrudEstudiante();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!isset($_POST['cedula_estudiante']) || empty($_POST['cedula_estudiante'])) {
        $_SESSION["error_message"] = "Debe ingresar una cédula";
        header("Location: index.php");
        exit();
    }

    $cedula = $_POST['cedula_estudiante'];
    $result = $crud->obtenerEstudianteporCedula($cedula);

    // Verificar si se encontró la cédula
    if ($result) {
        //
        $queryString = http_build_query([
            'cedula' => $result->getCedula(),
            'nombre' => $result->getNombre(),
            'apellido' => $result->getApellido(),
            'id' => $result->getId()
        ]);
        header("Location: EstudiantesPanel.php?$queryString");
        exit();
    } else {
        $_SESSION["error_message"] = "Número de cédula no encontrado";
        header("Location: index.php");
        exit();
    }
}
?>