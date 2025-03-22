<?php
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

try {
    $conexion = new PDO("mysql:host=localhost;dbname=pruebas_pro", "root", "");
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Obtener parámetros
    $pagina = isset($_GET['pagina']) ? (int)$_GET['pagina'] : 1;
    $registrosPorPagina = isset($_GET['registros_por_pagina']) ? (int)$_GET['registros_por_pagina'] : 20;
    $carrera = isset($_GET['carrera']) ? $_GET['carrera'] : 'all';
    $cedula = isset($_GET['cedula']) ? $_GET['cedula'] : '';
    $offset = ($pagina - 1) * $registrosPorPagina;
    
    // Preparar la consulta base
    $whereConditions = [];
    $params = [];
    
    // Agregar filtro por carrera si no es 'all'
    if ($carrera !== 'all') {
        $carreraMap = [
            'sistemas' => 'Ing. Sistemas',
            'datos' => 'Ing. Industrial',
            'software' => 'Adm. Empresas',
            'redes' => 'Diseño Gráfico',
            'ia' => 'Psicología'
        ];
        
        if (isset($carreraMap[$carrera])) {
            $whereConditions[] = "carrera = :carrera";
            $params[':carrera'] = $carreraMap[$carrera];
        }
    }
    
    // Agregar filtro por cédula si existe
    if (!empty($cedula)) {
        $whereConditions[] = "cedula_estudiante LIKE :cedula";
        $params[':cedula'] = "%$cedula%";
    }
    
    // Construir la cláusula WHERE
    $whereClause = !empty($whereConditions) ? "WHERE " . implode(" AND ", $whereConditions) : "";
    
    // Contar total de registros con los filtros aplicados
    $queryCount = "SELECT COUNT(*) FROM resultados_icfes $whereClause";
    $stmtCount = $conexion->prepare($queryCount);
    $stmtCount->execute($params);
    $totalRegistros = $stmtCount->fetchColumn();
    $totalPaginas = ceil($totalRegistros / $registrosPorPagina);
    
    // Consulta principal con paginación y filtros
    $query = "SELECT cedula_estudiante, nombre, carrera, punt_global, percentil_global 
             FROM resultados_icfes 
             $whereClause 
             LIMIT :offset, :registros_por_pagina";
    
    $stmt = $conexion->prepare($query);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->bindValue(':registros_por_pagina', $registrosPorPagina, PDO::PARAM_INT);
    foreach ($params as $param => $value) {
        $stmt->bindValue($param, $value);
    }
    $stmt->execute();
    
    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'datos' => $resultados,
        'pagina_actual' => $pagina,
        'total_paginas' => $totalPaginas,
        'registros_por_pagina' => $registrosPorPagina
    ]);
    
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error al cargar los datos']);
}
?>
