<?php
// Iniciar sesión si es necesario
session_start();

// Conexión a la base de datos - asegúrate de que la ruta sea correcta
require_once __DIR__ . '/connection.php';

try {
    // Obtener la conexión
    $conn = Connection::getConnection();
} catch (Exception $e) {
    die("Error: No se pudo establecer la conexión con la base de datos. " . $e->getMessage());
}

// Obtener el ID del estudiante de la sesión o GET
$cedula = isset($_GET['cedula']) ? htmlspecialchars($_GET['cedula']) : null;

if ($cedula) {
    // Consulta actualizada para coincidir con los nombres de las columnas
    $query = "SELECT 
        r.punt_matematicas,
        r.punt_lectura_critica,
        r.punt_ingles,
        r.punt_sociales_ciudadanas,
        r.punt_c_naturales,
        r.punt_global,
        r.percentil_matematicas,
        r.percentil_lectura_critica,
        r.percentil_ingles,
        r.percentil_sociales_ciudadanas,
        r.percentil_c_naturales,
        r.percentil_global,
        (SELECT AVG(punt_global) FROM resultados_icfes) as promedio_nacional
    FROM resultados_icfes r
    WHERE r.cedula_estudiante = ?";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $cedula);
    $stmt->execute();
    $result = $stmt->get_result();
    $datos = $result->fetch_assoc();

    // Calcular los porcentajes para las barras
    $porcentajes = array(
        'matematicas' => ($datos['punt_matematicas'] / 100) * 100,
        'lectura' => ($datos['punt_lectura_critica'] / 100) * 100,
        'ingles' => ($datos['punt_ingles'] / 100) * 100,
        'sociales' => ($datos['punt_sociales_ciudadanas'] / 100) * 100,
        'naturales' => ($datos['punt_c_naturales'] / 100) * 100
    );
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultados de Prueba</title>
    <link rel="icon" href="assets/img/icon.png" type="image/x-icon">
    <link rel="stylesheet" href="assets/CSS/estilos-estudiantes.css?v23433">
    <script async src="assets/js/script-estudiante.js?22343"></script>
</head>

<body>
    <div class="container">
        <header>
            <div class="user-info">
                Estudiante: <span
                    id="nombre"><?php echo isset($_GET['nombre']) ? htmlspecialchars($_GET['nombre']) : 'N/A'; ?></span>
                <div>Cedula: <span class="user-id"
                        id="id"><?php echo $cedula ?? 'N/A'; ?></span>
                </div>
            </div>
            <button class="logout" onclick="logout()">Cerrar Sesión</button>
        </header>

        <h1>Resultados de tus Pruebas</h1>

        <div class="result-section">
            <h2>Resultados Generales</h2>
            <div class="result-card">
                <div class="score"><?php echo $datos['punt_global'] ?? 'N/A'; ?>/500</div>
                <div class="table-container">
                    <table class="results-table">
                        <thead>
                            <tr>
                                <th>Área</th>
                                <th>Puntuación</th>
                                <th>Barra</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Matemáticas</td>
                                <td><?php echo $datos['punt_matematicas'] ?? 'N/A'; ?>/100
                                   
                                </td>
                                <td>
                                    <div class="table-bar-container">
                                        <div class="table-bar" style="width: <?php echo $porcentajes['matematicas'] ?? 0; ?>%; background-color: #4CAF50;"></div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Lectura Crítica</td>
                                <td><?php echo $datos['punt_lectura_critica'] ?? 'N/A'; ?>/100</td>
                                <td>
                                    <div class="table-bar-container">
                                        <div class="table-bar" style="width: <?php echo $porcentajes['lectura'] ?? 0; ?>%; background-color: #2196F3;"></div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Ingles</td>
                                <td><?php echo $datos['punt_ingles'] ?? 'N/A'; ?>/100</td>
                                <td>
                                    <div class="table-bar-container">
                                        <div class="table-bar" style="width: <?php echo $porcentajes['ingles'] ?? 0; ?>%; background-color:rgb(33, 194, 243);"></div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Sociales y Ciudadanas</td>
                                <td><?php echo $datos['punt_sociales_ciudadanas'] ?? 'N/A'; ?>/100</td>
                                <td>
                                    <div class="table-bar-container">
                                        <div class="table-bar" style="width: <?php echo $porcentajes['sociales'] ?? 0; ?>%; background-color:rgb(243, 33, 68);"></div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Ciencias Naturales</td>
                                <td><?php echo $datos['punt_c_naturales'] ?? 'N/A'; ?>/100</td>
                                <td>
                                    <div class="table-bar-container">
                                        <div class="table-bar" style="width: <?php echo $porcentajes['naturales'] ?? 0; ?>%; background-color:rgb(205, 243, 33);"></div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="average-comparison">
                    <div class="comparison-item">
                        <div class="comparison-label">Tu Puntaje</div>
                        <div class="comparison-value your-score"><?php echo $datos['punt_global'] ?? 'N/A'; ?></div>
                    </div>
                    <div class="comparison-item">
                        <div class="comparison-label">Promedio Nacional</div>
                        <div class="comparison-value avg-score"><?php echo round($datos['promedio_nacional'] ?? 0); ?></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="result-section">
            <h2>Detalle por Áreas</h2>
            <div class="result-card">
                <div class="chart-container">
                    <div class="chart-lines">
                        <?php for($i = 0; $i <= 100; $i += 20): ?>
                            <div class="chart-line">
                                <span class="chart-line-label"><?php echo $i; ?></span>
                            </div>
                        <?php endfor; ?>
                    </div>
                    <div class="column-bars">
                        <?php foreach ($porcentajes as $area => $porcentaje): ?>
                        <div class="column-item">
                            <div class="column-bar-container">
                                <div class="column-bar" style="height: <?php echo $porcentaje; ?>%; background-color: <?php echo getColorForArea($area); ?>;">
                                    <span class="column-value"><?php echo $datos[getColumnName($area)] ?? 'N/A'; ?></span>
                                </div>
                            </div>
                            <div class="column-label"><?php echo getAreaName($area); ?></div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>

</html>

<?php
// Funciones auxiliares
function getColorForArea($area) {
    $colors = [
        'matematicas' => '#4CAF50',
        'lectura' => '#2196F3',
        'ingles' => '#FF9800',
        'sociales' => '#9C27B0',
        'naturales' => '#E91E63'
    ];
    return $colors[$area] ?? '#999999';
}

function getColumnName($area) {
    $columns = [
        'matematicas' => 'punt_matematicas',
        'lectura' => 'punt_lectura_critica',
        'ingles' => 'punt_ingles',
        'sociales' => 'punt_sociales_ciudadanas',
        'naturales' => 'punt_c_naturales'
    ];
    return $columns[$area] ?? '';
}

function getPercentilColumn($area) {
    $columns = [
        'matematicas' => 'percentil_matematicas',
        'lectura' => 'percentil_lectura_critica',
        'ingles' => 'percentil_ingles',
        'sociales' => 'percentil_sociales_ciudadanas',
        'naturales' => 'percentil_c_naturales'
    ];
    return $columns[$area] ?? '';
}

function getAreaName($area) {
    $names = [
        'matematicas' => 'Matemáticas',
        'lectura' => 'Lectura Crítica',
        'ingles' => 'Inglés',
        'sociales' => 'Sociales y Ciudadanas',
        'naturales' => 'Ciencias Naturales'
    ];
    return $names[$area] ?? '';
}
?>