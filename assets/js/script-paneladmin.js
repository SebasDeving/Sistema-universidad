function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
        
        // Actualizar menú activo
        document.querySelectorAll('.menu li').forEach(item => {
            item.classList.remove('active');
        });
        
        const menuItem = document.querySelector(`.menu li[onclick="showSection('${sectionId}')"]`);
        if (menuItem) {
            menuItem.classList.add('active');
        }

        // Si es la sección de comparación, inicializar el gráfico
        if(sectionId === 'comparison') {
            initializeComparisonChart();
        }
    }
}

function logout() {
    // Lógica para cerrar sesión
    console.log('Cerrando sesión...');
    // Redirigir a la página de login
    window.location.href = 'index.php';
}

let paginaActual = 1;
const registrosPorPagina = 20;
let carreraSeleccionada = 'all';

// Función para cargar resultados con filtro de carrera
function cargarResultados(pagina, carrera = 'all', cedula = '') {
    const tablaResultados = document.getElementById('tabla-resultados');
    const btnAnterior = document.getElementById('anterior');
    const btnSiguiente = document.getElementById('siguiente');
    const spanPaginaActual = document.getElementById('pagina-actual');
    const spanTotalPaginas = document.getElementById('total-paginas');

    // Incluir cédula en la URL si existe
    let url = `obtener_resultados.php?pagina=${pagina}&carrera=${carrera}&registros_por_pagina=${registrosPorPagina}`;
    if (cedula) {
        url += `&cedula=${cedula}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            tablaResultados.innerHTML = '';
            
            data.datos.forEach(estudiante => {
                tablaResultados.innerHTML += `
                    <tr>
                        <td>${estudiante.cedula_estudiante}</td>
                        <td>${estudiante.nombre}</td>
                        <td>${estudiante.carrera}</td>
                        <td>${estudiante.punt_global}</td>
                        <td>${estudiante.percentil_global}</td>
                    </tr>
                `;
            });

            // Actualizar paginación
            spanPaginaActual.textContent = pagina;
            spanTotalPaginas.textContent = data.total_paginas;
            btnAnterior.disabled = pagina <= 1;
            btnSiguiente.disabled = pagina >= data.total_paginas;
        })
        .catch(error => console.error('Error:', error));
}

// Event listeners cuando el documento esté listo
document.addEventListener('DOMContentLoaded', () => {
    const btnAnterior = document.getElementById('anterior');
    const btnSiguiente = document.getElementById('siguiente');
    const careerFilter = document.getElementById('career-filter');
    const studentSearch = document.getElementById('student-search');

    // Event listener para la búsqueda por cédula
    let timeoutId;
    studentSearch.addEventListener('input', function() {
        clearTimeout(timeoutId);
        const cedula = this.value.trim();
        
        // Esperar 500ms después de que el usuario deje de escribir
        timeoutId = setTimeout(() => {
            paginaActual = 1; // Resetear a la primera página
            cargarResultados(paginaActual, carreraSeleccionada, cedula);
        }, 500);
    });

    // Event listener para el filtro de carreras
    careerFilter.addEventListener('change', function() {
        carreraSeleccionada = this.value;
        paginaActual = 1;
        cargarResultados(paginaActual, carreraSeleccionada, studentSearch.value.trim());
    });

    // Event listeners para la paginación
    btnAnterior.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            cargarResultados(paginaActual, carreraSeleccionada, studentSearch.value.trim());
        }
    });

    btnSiguiente.addEventListener('click', () => {
        paginaActual++;
        cargarResultados(paginaActual, carreraSeleccionada, studentSearch.value.trim());
    });

    // Cargar datos iniciales
    cargarResultados(1, 'all', '');
});

// Función de inicialización
function inicializarTabla() {
    // Obtener referencias a los elementos del DOM
    btnAnterior = document.getElementById('anterior');
    btnSiguiente = document.getElementById('siguiente');
    tablaResultados = document.getElementById('tabla-resultados');
    paginaActualSpan = document.getElementById('pagina-actual');
    totalPaginasSpan = document.getElementById('total-paginas');

    // Verificar que todos los elementos necesarios existen
    if (!btnAnterior || !btnSiguiente || !tablaResultados || !paginaActualSpan || !totalPaginasSpan) {
        console.error('No se encontraron todos los elementos necesarios en el DOM');
        return;
    }

    // Event listeners para los botones
    btnAnterior.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            cargarResultados(paginaActual);
        }
    });

    btnSiguiente.addEventListener('click', () => {
        paginaActual++;
        cargarResultados(paginaActual);
    });

    // Cargar la primera página
    cargarResultados(1);
}

// Esperar a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', inicializarTabla);

// Event listeners para los botones de paginación
document.addEventListener('DOMContentLoaded', function() {
    let paginaActual = 1;

    document.getElementById('anterior').addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            cargarResultados(paginaActual);
        }
    });

    document.getElementById('siguiente').addEventListener('click', () => {
        paginaActual++;
        cargarResultados(paginaActual);
    });

    // Cargar la primera página al iniciar
    cargarResultados(1);
});

// Ejecutar cuando el documento esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Cargar la primera página al iniciar
    cargarResultados(1);
});

// Agregar event listeners para los botones de paginación
document.addEventListener('DOMContentLoaded', function() {
    const anterior = document.querySelector('.paginacion button.anterior');
    const siguiente = document.querySelector('.paginacion button.siguiente');
    let paginaActual = 1;

    anterior.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            cargarResultados(paginaActual);
        }
    });

    siguiente.addEventListener('click', () => {
        paginaActual++;
        cargarResultados(paginaActual);
    });

    // Cargar la primera página al iniciar
    cargarResultados(1);
});

document.getElementById('anterior').addEventListener('click', () => {
    if (paginaActual > 1) {
        paginaActual--;
        cargarResultados(paginaActual);
    }
});

document.getElementById('siguiente').addEventListener('click', () => {
    if (paginaActual < totalPaginas) {
        paginaActual++;
        cargarResultados(paginaActual);
    }
});

// Cargar la primera página al iniciar
cargarResultados(1);

// CARRERAS LA LOGICA 
// Función para cargar estadísticas por carrera
function cargarEstadisticasCarrera() {
    fetch('estadistica_carreras.php')
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('table tbody');
            tbody.innerHTML = ''; // Limpiar tabla
            
            data.datos.forEach(carrera => {
                // Determinar si la tendencia es positiva o negativa
                const tendenciaClase = carrera.tendencia > 0 ? 'trend-up' : 'trend-down';
                const tendenciaFlecha = carrera.tendencia > 0 ? '↑' : '↓';
                
                tbody.innerHTML += `
                    <tr>
                        <td>${carrera.carrera}</td>
                        <td>${carrera.total_estudiantes}</td>
                        <td>${carrera.promedio_puntaje}</td>
                        <td>${carrera.promedio_percentil}</td>
                        <td><span class="${tendenciaClase}">${tendenciaFlecha} ${Math.abs(carrera.tendencia)}%</span></td>
                    </tr>
                `;
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.querySelector('table tbody').innerHTML = `
                <tr>
                    <td colspan="5">Error al cargar las estadísticas</td>
                </tr>
            `;
        });
}

// Cargar estadísticas cuando el documento esté listo
document.addEventListener('DOMContentLoaded', cargarEstadisticasCarrera);

// Esperar a que el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Función para mostrar secciones
    window.showSection = function(sectionId) {
        console.log('Intentando mostrar sección:', sectionId);
        
        // Ocultar todas las secciones
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Mostrar la sección seleccionada
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.add('active');
            console.log('Sección activada:', sectionId);
        }
        
        // Actualizar menú
        document.querySelectorAll('.menu li').forEach(item => {
            item.classList.remove('active');
        });
        
        const menuItem = document.querySelector(`.menu li[onclick="showSection('${sectionId}')"]`);
        if (menuItem) {
            menuItem.classList.add('active');
        }
    };

    // Función para actualizar comparación
    window.actualizarComparacion = function() {
        const carrera1Select = document.getElementById('carrera1');
        const carrera2Select = document.getElementById('carrera2');
        
        if (carrera1Select && carrera2Select) {
            const carrera1 = carrera1Select.value;
            const carrera2 = carrera2Select.value;
            console.log('Comparando', carrera1, 'con', carrera2);
        }
    };

    // Función para cerrar sesión
    window.logout = function() {
        window.location.href = 'logout.php';
    };

    // Inicializar los event listeners solo si los elementos existen
    const carrera1Select = document.getElementById('carrera1');
    const carrera2Select = document.getElementById('carrera2');
    const refreshBtn = document.querySelector('.refresh-btn');

    if (carrera1Select) {
        carrera1Select.addEventListener('change', actualizarComparacion);
    }

    if (carrera2Select) {
        carrera2Select.addEventListener('change', actualizarComparacion);
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', actualizarComparacion);
    }

    // Inicializar la primera sección activa
    const currentSection = document.querySelector('.section.active');
    if (!currentSection) {
        showSection('dashboard');
    }
});

// Función para actualizar la comparación
function actualizarComparacion() {
    const carrera1 = document.getElementById('carrera1').value;
    const carrera2 = document.getElementById('carrera2').value;
    
    // Aquí irían las llamadas AJAX para obtener los datos actualizados
    // Por ahora solo actualizamos la UI con datos de ejemplo
    
    // Actualizar valores y animaciones
    actualizarMetricas(carrera1, carrera2);
}

function actualizarMetricas(carrera1, carrera2) {
    // Aquí iría la lógica para actualizar los valores en la UI
    console.log(`Comparando ${carrera1} con ${carrera2}`);
}

// Asegurarse de que el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la comparación
    actualizarComparacion();
});

// Código de depuración
console.log('Secciones disponibles:', document.querySelectorAll('.section').length);
console.log('Sección de comparación:', document.getElementById('comparison'));

// Código de depuración
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que las secciones existen
    console.log('Todas las secciones:', document.querySelectorAll('.section'));
    console.log('Sección comparacion:', document.getElementById('comparison'));
    
    // Verificar los estilos
    const comparacionSection = document.getElementById('comparison');
    if (comparacionSection) {
        console.log('Estilos de comparacion:', window.getComputedStyle(comparacionSection));
    }
    
    // Agregar listener para cambios de clase
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                console.log('Clases cambiadas:', mutation.target.className);
            }
        });
    });
    
    if (comparacionSection) {
        observer.observe(comparacionSection, { attributes: true });
    }
});

// Función para inicializar el gráfico de comparación
function initializeComparisonChart() {
    const ctx = document.getElementById('materiasChart');
    if (!ctx) return; // Si no existe el elemento, salir de la función

    try {
        // Si ya existe un gráfico, destruirlo
        if (window.materiasChart instanceof Chart) {
            window.materiasChart.destroy();
        }

        window.materiasChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Matemáticas', 'Lectura Crítica', 'Ciencias Naturales', 'Sociales', 'Inglés'],
                datasets: [{
                    data: [75.5, 82.3, 68.7, 71.2, 77.8],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al inicializar el gráfico:', error);
    }
}

// Función para inicializar los event listeners
function initializeEventListeners() {
    // Inicializar la primera sección activa
    const activeSection = document.querySelector('.section.active');
    if (activeSection && activeSection.id === 'comparison') {
        initializeComparisonChart();
    }

    // Event listeners para los filtros
    const elements = {
        careerFilter: document.getElementById('career-filter'),
        studentSearch: document.getElementById('student-search'),
        periodoComparacion: document.getElementById('periodo-comparison')
    };

    // Agregar event listeners solo si los elementos existen
    if (elements.careerFilter) {
        elements.careerFilter.addEventListener('change', function() {
            console.log('Filtro de carrera cambiado:', this.value);
        });
    }

    if (elements.studentSearch) {
        elements.studentSearch.addEventListener('input', function() {
            console.log('Búsqueda:', this.value);
        });
    }

    if (elements.periodoComparacion) {
        elements.periodoComparacion.addEventListener('change', function() {
            console.log('Período seleccionado:', this.value);
        });
    }
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeEventListeners();
    } catch (error) {
        console.error('Error al inicializar los event listeners:', error);
      

    }
});
