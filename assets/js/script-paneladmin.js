// Variables globales
let paginaActual = 1;
const registrosPorPagina = 20;
let carreraSeleccionada = 'all';
let materiasChart = null;
let comparacionChart = null;

// Gestión de secciones
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

        // Inicializar componentes específicos de la sección
        if (sectionId === 'comparison') {
            initializeComparisonChart();
        }
    }
}

// Gestión de sesión
function logout() {
    window.location.href = 'logout.php';
}

// Gestión de resultados y paginación
function cargarResultados(pagina, carrera = 'all', cedula = '') {
    const tablaResultados = document.getElementById('tabla-resultados');
    const btnAnterior = document.getElementById('anterior');
    const btnSiguiente = document.getElementById('siguiente');
    const spanPaginaActual = document.getElementById('pagina-actual');
    const spanTotalPaginas = document.getElementById('total-paginas');

    if (!tablaResultados || !btnAnterior || !btnSiguiente || !spanPaginaActual || !spanTotalPaginas) {
        console.error('Elementos de paginación no encontrados');
        return;
    }

    pagina = parseInt(pagina) || 1;
    
    let url = `obtener_resultados.php?pagina=${pagina}&carrera=${carrera}&registros_por_pagina=${registrosPorPagina}`;
    if (cedula) {
        url += `&cedula=${cedula}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
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

            paginaActual = pagina;
            spanPaginaActual.textContent = pagina;
            spanTotalPaginas.textContent = data.total_paginas;
            btnAnterior.disabled = pagina <= 1;
            btnSiguiente.disabled = pagina >= data.total_paginas;
        })
        .catch(error => {
            console.error('Error al cargar resultados:', error);
            mostrarToast('Error al cargar los resultados', 3000);
        });
}

// Gestión de estadísticas
function cargarEstadisticasCarrera() {
    fetch('estadistica_carreras.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            const tbody = document.querySelector('table tbody');
            if (!tbody) {
                throw new Error('Tabla de estadísticas no encontrada');
            }
            
            tbody.innerHTML = '';
            
            data.datos.forEach(carrera => {
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
            console.error('Error al cargar estadísticas:', error);
            const tbody = document.querySelector('table tbody');
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5">Error al cargar las estadísticas</td>
                    </tr>
                `;
            }
        });
}

// Gestión de gráficos
function initializeComparisonChart() {
    const ctx = document.getElementById('materiasChart');
    if (!ctx) return;

    try {
        if (materiasChart instanceof Chart) {
            materiasChart.destroy();
        }

        materiasChart = new Chart(ctx, {
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

// Gestión de comparación
function compararCarreras() {
    const carrera1 = document.getElementById('carrera1-select')?.value;
    const carrera2 = document.getElementById('carrera2-select')?.value;
    
    if (!carrera1 || !carrera2) {
        mostrarToast('Selecciona dos carreras para comparar');
        return;
    }

    fetch(`/Sistema-universidad/comparacion_carreras.php?carrera1=${encodeURIComponent(carrera1)}&carrera2=${encodeURIComponent(carrera2)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.mensaje || 'Error al obtener los datos');
            }
            actualizarGraficoComparacion(data);
            actualizarEstadisticas(data);
        })
        .catch(error => {
            console.error('Error en la comparación:', error);
            mostrarToast('Error al obtener los datos de comparación: ' + error.message);
        });
}

// Utilidades
function mostrarToast(mensaje, duracion = 5000) {
    const toast = document.getElementById('toast-notification');
    const mensajeElement = document.getElementById('toast-message');
    
    if (!toast || !mensajeElement) {
        console.error('Elementos de toast no encontrados');
        return;
    }
    
    mensajeElement.textContent = mensaje;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duracion);
}

function formatearNumero(numero) {
    if (Number.isInteger(Number(numero))) {
        return new Intl.NumberFormat('es-CO').format(numero);
    }
    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(numero);
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Verificar dependencias
    if (typeof Chart === 'undefined') {
        console.error('Chart.js no está cargado');
        return;
    }

    // Inicializar event listeners
    const elements = {
        btnAnterior: document.getElementById('anterior'),
        btnSiguiente: document.getElementById('siguiente'),
        careerFilter: document.getElementById('career-filter'),
        studentSearch: document.getElementById('student-search'),
        carrera1Select: document.getElementById('carrera1-select'),
        carrera2Select: document.getElementById('carrera2-select'),
        refreshBtn: document.querySelector('.refresh-btn')
    };

    // Paginación
    if (elements.btnAnterior) {
        elements.btnAnterior.addEventListener('click', () => {
            if (paginaActual > 1) {
                cargarResultados(paginaActual - 1, carreraSeleccionada, elements.studentSearch?.value?.trim() || '');
            }
        });
    }

    if (elements.btnSiguiente) {
        elements.btnSiguiente.addEventListener('click', () => {
            cargarResultados(paginaActual + 1, carreraSeleccionada, elements.studentSearch?.value?.trim() || '');
        });
    }

    // Búsqueda
    if (elements.studentSearch) {
        let timeoutId;
        elements.studentSearch.addEventListener('input', function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                cargarResultados(1, carreraSeleccionada, this.value.trim());
            }, 500);
        });
    }

    // Filtros
    if (elements.careerFilter) {
        elements.careerFilter.addEventListener('change', function() {
            carreraSeleccionada = this.value;
            cargarResultados(1, carreraSeleccionada, elements.studentSearch?.value?.trim() || '');
        });
    }

    // Comparación
    if (elements.carrera1Select && elements.carrera2Select) {
        elements.carrera1Select.addEventListener('change', compararCarreras);
        elements.carrera2Select.addEventListener('change', compararCarreras);
    }

    if (elements.refreshBtn) {
        elements.refreshBtn.addEventListener('click', compararCarreras);
    }

    // Cargar datos iniciales
    cargarResultados(1);
    cargarEstadisticasCarrera();

    // Inicializar primera sección
    const currentSection = document.querySelector('.section.active');
    if (!currentSection) {
        showSection('dashboard');
    }
});