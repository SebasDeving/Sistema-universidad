<?php
// Agregar al principio del archivo, antes del HTML
$servername = "localhost";
$username = "root";  // Tu usuario de MySQL
$password = "";      // Tu contraseña de MySQL
$dbname = "pruebas_pro";  // El nombre de tu base de datos

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Establecer charset a utf8
$conn->set_charset("utf8");
?>

<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Admin - PruebasPro</title>
    <link rel="icon" href="assets/img/icon.png" type="image/x-icon">
    <link rel="stylesheet" href="assets/CSS/estilos-paneladmin.css?v33445">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="assets/js/script-paneladmin.js?v33241"></script>
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <div class="logo">
                <span class="logo-text">AdminPanel</span>
            </div>
            <ul class="menu">
                <li class="active" onclick="showSection('dashboard')">
                    <span class="menu-item-icon">
                        <i class="fas fa-chart-line"></i>
                    </span>
                    <span class="menu-text">Dashboard</span>
                </li>
                <li onclick="showSection('students')">
                    <span class="menu-item-icon">
                        <i class="fas fa-user-graduate"></i>
                    </span>
                    <span class="menu-text">Estudiantes</span>
                </li>
                <li onclick="showSection('careers')">
                    <span class="menu-item-icon">
                        <i class="fas fa-graduation-cap"></i>
                    </span>
                    <span class="menu-text">Carreras</span>
                </li>
                <li onclick="showSection('comparison')">
                    <span class="menu-item-icon">
                        <i class="fas fa-chart-line"></i>
                    </span>
                    <span class="menu-text">Comparación</span>
                </li>
               
                
            </ul>
        </div>
        
        <div class="content">
            <div class="header">
                
                <h2>Panel de Administrador</h2>
                <div class="user-info">
                    <span class="user-name">Administrador</span>
                    <button class="logout-btn" onclick="logout()">Cerrar Sesión</button>
                </div>
                
            </div>
            
            <!-- Dashboard Section -->
            <div id="dashboard" class="section active">
                <div class="panel">
                    <div class="panel-header">
                        <div class="panel-title">Estadísticas Generales</div>
                        <div class="filter-controls">       
                        </div>
                    </div>
                    
                    
                    <div class="stats-container">
                        <div class="stat-card animate-card">
                            <div class="stat-icon">👥</div>
                            <div class="stat-content">
                                <div class="stat-label">Total Estudiantes</div>
                                <div class="stat-value counter">500</div>
                                <div class="stat-desc positive">↑ 5.2% vs anterior</div>
                            </div>
                        </div>
                        <div class="stat-card animate-card">
                            <div class="stat-icon">📊</div>
                            <div class="stat-content">
                                <div class="stat-label">Promedio General</div>
                                <div class="stat-value counter">72.3</div>
                                <div class="stat-desc positive">↑ 1.8% vs anterior</div>
                            </div>
                        </div>
                        <div class="stat-card animate-card">
                            <div class="stat-icon">📝</div>
                            <div class="stat-content">
                                <div class="stat-label">Pruebas Realizadas</div>
                                <div class="stat-value counter">500</div>
                                <div class="stat-desc positive">↑ 12.4% vs anterior</div>
                            </div>
                        </div>
                        <div class="stat-card animate-card">
                            <div class="stat-icon">🏆</div>
                            <div class="stat-content">
                                <div class="stat-label">Mejor Carrera</div>
                                <div class="stat-value">Ingenieria de Sistemas</div>
                                <div class="stat-desc">Prom. 83.7</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="chart-container" style="padding-bottom: 92px;">
                        <div class="panel-title">Rendimiento por Carrera</div>
                        <div class="chart-bars">
                            <div class="bar" style="height: 65%;">
                                <div class="bar-value">65%</div>
                                <div class="bar-label">Ing. Sistemas</div>
                            </div>
                            <div class="bar" style="height: 85%;">
                                <div class="bar-value">85%</div>
                                <div class="bar-label">Ing. Industrial</div>
                            </div>
                            <div class="bar" style="height: 72%;">
                                <div class="bar-value">72%</div>
                                <div class="bar-label">Adm. Empresas</div>
                            </div>
                            <div class="bar" style="height: 58%;">
                                <div class="bar-value">58%</div>
                                <div class="bar-label">Diseño Gráfico</div>
                            </div>
                            <div class="bar" style="height: 77%;">
                                <div class="bar-value">77%</div>
                                <div class="bar-label">Psicología</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Students Section -->
            <div id="students" class="section">
                <div class="panel">
                    <div class="panel-header">
                        <div class="panel-title">Rendimiento de Estudiantes</div>
                        <div class="filter-controls">
                            <select id="career-filter">
                                <option value="all">Todas las carreras</option>
                                <option value="sistemas">Ing. de Sistemas</option>
                                <option value="datos">Ing. Industrial</option>
                                <option value="software">Adm. Empresas</option>
                                <option value="redes">Diseño Gráfico</option>
                                <option value="ia">Psicología</option>
                            </select>
                            <input type="text" placeholder="Buscar por cedula" id="student-search">
                        </div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Cedula</th>
                                <th>Nombre</th>
                                <th>Carrera</th>
                                <th>Puntaje General</th>
                                <th>Percentil Global</th>
                            </tr>
                        </thead>
                        <tbody id="tabla-resultados">
                            <!-- Los datos se cargarán dinámicamente -->
                        </tbody>
                    </table>
                    
                    <div class="paginacion">
                        <button id="anterior">Anterior</button>
                        <span id="pagina-actual">1</span> de <span id="total-paginas">1</span>
                        <button id="siguiente">Siguiente</button>
                    </div> 
                </div>
            </div>
            
            <!-- Careers Section -->
            <div id="careers" class="section">
                <div class="panel">
                    <div class="panel-header">
                        <div class="panel-title">Análisis por Carreras</div>
                        <div class="filter-controls">
                            <select id="year-filter">
                                <option value="2024">2024</option>
                            </select>
                        </div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Carrera</th>
                                <th>Estudiantes</th>
                                <th>Puntaje Global</th>
                                <th>Percentil Global</th>
                                <th>Tendencia</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            // Consulta para obtener estadísticas por carrera
                            $query = "SELECT 
                                carrera,
                                COUNT(*) as total_estudiantes,
                                AVG(punt_global) as promedio_puntaje,
                                NTILE(100) OVER (ORDER BY punt_global) as percentil
                            FROM resultados_icfes
                            GROUP BY carrera
                            ORDER BY promedio_puntaje DESC";
                            
                            $result = $conn->query($query);
                            
                            if ($result) {
                                while($row = $result->fetch_assoc()) {
                                    // Simulamos diferentes tendencias basadas en el puntaje promedio
                                    $tendencia = rand(-5, 8); // Generamos un número aleatorio entre -5 y 8
                                    $clase_tendencia = $tendencia >= 0 ? 'trend-up' : 'trend-down';
                                    $flecha = $tendencia >= 0 ? '↑' : '↓';
                                    
                                    echo "<tr>";
                                    echo "<td>" . htmlspecialchars($row['carrera']) . "</td>";
                                    echo "<td>" . htmlspecialchars($row['total_estudiantes']) . "</td>";
                                    echo "<td>" . number_format($row['promedio_puntaje'], 1) . "</td>";
                                    echo "<td>" . number_format($row['percentil'], 1) . "</td>";
                                    echo "<td><span class='" . $clase_tendencia . "'>" . $flecha . " " . abs($tendencia) . "%</span></td>";
                                    echo "</tr>";
                                }
                            } else {
                                echo "<tr><td colspan='5'>Error al obtener los datos: " . $conn->error . "</td></tr>";
                            }
                            ?>
                        </tbody>
                    </table>
                    <div class="chart-container" style="padding-bottom: 132px;">
                        <div class="panel-title">Distribución de Puntajes por Carrera</div>
                        <div class="chart-bars animated">
                            <div class="bar" style="height: 65%; background-color: #4CAF50;">
                                <div class="bar-value">65%</div>
                                <div class="bar-label">Ing. Sistemas</div>
                            </div>
                            <div class="bar" style="height: 85%; background-color: #2196F3;">
                                <div class="bar-value">85%</div>
                                <div class="bar-label">Ing. Industrial</div>
                            </div>
                            <div class="bar" style="height: 72%; background-color: #FFC107;">
                                <div class="bar-value">72%</div>
                                <div class="bar-label">Adm. Empresas</div>
                            </div>
                            <div class="bar" style="height: 58%; background-color: #9C27B0;">
                                <div class="bar-value">58%</div>
                                <div class="bar-label">Diseño Gráfico</div>
                            </div>
                            <div class="bar" style="height: 77%; background-color: #FF5722;">
                                <div class="bar-value">77%</div>
                                <div class="bar-label">Psicología</div>
                            </div>
                        </div>
                        <div class="chart-legend animated">
                            <div class="legend-item">
                                <div class="legend-color pulse" style="background-color: #4CAF50;"></div>
                                <div class="legend-text">Ing. Sistemas</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color pulse" style="background-color: #2196F3;"></div>
                                <div class="legend-text">Ing. Industrial</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color pulse" style="background-color: #FFC107;"></div>
                                    <div class="legend-text">Adm. Empresas</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color pulse" style="background-color: #9C27B0;"></div>
                                <div class="legend-text">Diseño Gráfico</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color pulse" style="background-color: #FF5722;"></div>
                                <div class="legend-text">Psicología</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- TENEMOS ACA LAS SECCION DE COMPARACION -->
        <div id="comparison" class="section">
            <div class="panel">
                <div class="panel-header">
                    <div class="panel-title">Comparación de Carreras</div>
                    <div class="filter-controls">
                        <select id="periodo-comparison">
                            <option value="2024">2024</option>
                        </select>
                    </div>
                </div>
                
                <div class="comparison-container">
                    <div class="comparison-filters">
                        <select id="carrera1-select" class="comparison-select">
                            <option value="">Seleccionar primera carrera</option>
                            <?php
                            $query = "SELECT DISTINCT carrera FROM resultados_icfes ORDER BY carrera";
                            $result = $conn->query($query);
                            while($row = $result->fetch_assoc()) {
                                echo "<option value='" . htmlspecialchars($row['carrera']) . "'>" . 
                                     htmlspecialchars($row['carrera']) . "</option>";
                            }
                            ?>
                        </select>
                        
                        <select id="carrera2-select" class="comparison-select">
                            <option value="">Seleccionar segunda carrera</option>
                            <?php
                            $result->data_seek(0);
                            while($row = $result->fetch_assoc()) {
                                echo "<option value='" . htmlspecialchars($row['carrera']) . "'>" . 
                                     htmlspecialchars($row['carrera']) . "</option>";
                            }
                            ?>
                        </select>
                        
                        <button id="comparar-btn" onclick="compararCarreras()">Comparar</button>
                    </div>

                    <div class="comparison-results">
                        <div class="comparison-card">
                            <canvas id="comparacionPuntajes"></canvas>
                        </div>
                        
                        <div class="comparison-stats">
                            <div class="stat-comparison-card">
                                <h3>
                                    <i class="fas fa-chart-line"></i>
                                    Promedio Global
                                </h3>
                                <div class="comparison-values">
                                    <div id="promedio-carrera1" class="comparison-value" data-label="Primera Carrera">
                                        <div class="value-label">Carrera 1</div>
                                        <div class="value-number">--</div>
                                    </div>
                                    <div id="promedio-carrera2" class="comparison-value" data-label="Segunda Carrera">
                                        <div class="value-label">Carrera 2</div>
                                        <div class="value-number">--</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="stat-comparison-card">
                                <h3>
                                    <i class="fas fa-users"></i>
                                    Total Estudiantes
                                </h3>
                                <div class="comparison-values">
                                    <div id="estudiantes-carrera1" class="comparison-value" data-label="Primera Carrera">
                                        <div class="value-label">Carrera 1</div>
                                        <div class="value-number">--</div>
                                    </div>
                                    <div id="estudiantes-carrera2" class="comparison-value" data-label="Segunda Carrera">
                                        <div class="value-label">Carrera 2</div>
                                        <div class="value-number">--</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     </div>
  </body>
</html>

<!-- Toast de notificación -->
<div class="toast-container">
    <div id="toast-notification" class="toast-notification">
        <i class="fas fa-info-circle"></i>
        <span id="toast-message"></span>
    </div>
</div>

