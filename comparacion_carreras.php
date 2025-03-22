<?php
// Deshabilitar la salida de errores PHP al navegador
ini_set('display_errors', 0);
error_reporting(0);

// Asegurarse de que siempre enviemos JSON
header('Content-Type: application/json');

try {
    // Configuración de la base de datos
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "pruebas_pro";

    // Crear conexión
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Verificar conexión
    if ($conn->connect_error) {
        throw new Exception('Error de conexión a la base de datos');
    }

    // Establecer charset a utf8
    $conn->set_charset("utf8");

    // Obtener y validar parámetros
    if (!isset($_GET['carrera1']) || !isset($_GET['carrera2'])) {
        throw new Exception('Se requieren dos carreras para la comparación');
    }

    $carrera1 = $_GET['carrera1'];
    $carrera2 = $_GET['carrera2'];

    // Consulta SQL
    $query = "SELECT 
        carrera,
        COUNT(*) as total_estudiantes,
        ROUND(AVG(punt_global), 1) as promedio_global,
        ROUND(AVG(percentil_lectura_critica), 1) as promedio_lectura,
        ROUND(AVG(percentil_matematicas), 1) as promedio_matematicas,
        ROUND(AVG(percentil_c_naturales), 1) as promedio_ciencias,
        ROUND(AVG(percentil_sociales_ciudadanas), 1) as promedio_sociales,
        ROUND(AVG(percentil_ingles), 1) as promedio_ingles
    FROM resultados_icfes 
    WHERE carrera IN (?, ?)
    GROUP BY carrera";

    // Preparar y ejecutar la consulta
    $stmt = $conn->prepare($query);
    if (!$stmt) {
        throw new Exception('Error al preparar la consulta');
    }

    $stmt->bind_param("ss", $carrera1, $carrera2);
    if (!$stmt->execute()) {
        throw new Exception('Error al ejecutar la consulta');
    }

    $result = $stmt->get_result();

    // Preparar datos
    $datos = [
        'carrera1' => [
            'nombre' => $carrera1,
            'promedio_global' => 0,
            'total_estudiantes' => 0,
            'puntajes' => [0, 0, 0, 0, 0]
        ],
        'carrera2' => [
            'nombre' => $carrera2,
            'promedio_global' => 0,
            'total_estudiantes' => 0,
            'puntajes' => [0, 0, 0, 0, 0]
        ]
    ];

    // Procesar resultados
    while ($row = $result->fetch_assoc()) {
        $carreraDatos = [
            'nombre' => $row['carrera'],
            'promedio_global' => floatval($row['promedio_global']),
            'total_estudiantes' => intval($row['total_estudiantes']),
            'puntajes' => [
                floatval($row['promedio_lectura']),
                floatval($row['promedio_matematicas']),
                floatval($row['promedio_ciencias']),
                floatval($row['promedio_sociales']),
                floatval($row['promedio_ingles'])
            ]
        ];
        
        if ($row['carrera'] === $carrera1) {
            $datos['carrera1'] = $carreraDatos;
        } else {
            $datos['carrera2'] = $carreraDatos;
        }
    }

    // Cerrar conexiones
    $stmt->close();
    $conn->close();

    // Enviar respuesta
    echo json_encode($datos);

} catch (Exception $e) {
    // Asegurar que cualquier error se devuelva como JSON
    echo json_encode([
        'error' => true,
        'mensaje' => $e->getMessage()
    ]);
}
?>