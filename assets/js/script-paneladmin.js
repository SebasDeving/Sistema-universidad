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

    // Asegurar que pagina sea un número válido
    pagina = parseInt(pagina) || 1;
    
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
            paginaActual = pagina; // Asegurar que paginaActual sea el valor correcto
            spanPaginaActual.textContent = pagina;
            spanTotalPaginas.textContent = data.total_paginas;
            btnAnterior.disabled = pagina <= 1;
            btnSiguiente.disabled = pagina >= data.total_paginas;
        })
        .catch(error => console.error('Error:', error));
}

// Event listeners cuando el documento esté listo - SOLO ESTE BLOQUE DE PAGINACIÓN
document.addEventListener('DOMContentLoaded', () => {
    // Remover todas las definiciones duplicadas y sólo usar esta
    const btnAnterior = document.getElementById('anterior');
    const btnSiguiente = document.getElementById('siguiente');
    const careerFilter = document.getElementById('career-filter');
    const studentSearch = document.getElementById('student-search');
    
    // Limpiar event listeners existentes (para evitar duplicados)
    if (btnAnterior) {
        const nuevoAnterior = btnAnterior.cloneNode(true);
        btnAnterior.parentNode.replaceChild(nuevoAnterior, btnAnterior);
        
        // Añadir nuevo listener
        nuevoAnterior.addEventListener('click', () => {
            if (paginaActual > 1) {
                cargarResultados(paginaActual - 1, carreraSeleccionada, studentSearch?.value?.trim() || '');
            }
        });
    }
    
    if (btnSiguiente) {
        const nuevoSiguiente = btnSiguiente.cloneNode(true);
        btnSiguiente.parentNode.replaceChild(nuevoSiguiente, btnSiguiente);
        
        // Añadir nuevo listener
        nuevoSiguiente.addEventListener('click', () => {
            cargarResultados(paginaActual + 1, carreraSeleccionada, studentSearch?.value?.trim() || '');
        });
    }

    // Event listener para la búsqueda por cédula
    if (studentSearch) {
        let timeoutId;
        studentSearch.addEventListener('input', function() {
            clearTimeout(timeoutId);
            const cedula = this.value.trim();
            
            // Esperar 500ms después de que el usuario deje de escribir
            timeoutId = setTimeout(() => {
                cargarResultados(1, carreraSeleccionada, cedula);
            }, 500);
        });
    }

    // Event listener para el filtro de carreras
    if (careerFilter) {
        careerFilter.addEventListener('change', function() {
            carreraSeleccionada = this.value;
            cargarResultados(1, carreraSeleccionada, studentSearch?.value?.trim() || '');
        });
    }

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
    const btnAnterior = document.getElementById('anterior');
    const btnSiguiente = document.getElementById('siguiente');
    let paginaActual = 1;

    // Verificar si los elementos existen antes de añadir listeners
    if (btnAnterior) {
        btnAnterior.addEventListener('click', () => {
            if (paginaActual > 1) {
                paginaActual--;
                cargarResultados(paginaActual);
            }
        });
    }

    if (btnSiguiente) {
        btnSiguiente.addEventListener('click', () => {
            paginaActual++;
            cargarResultados(paginaActual);
        });
    }

    // Cargar la primera página al iniciar
    cargarResultados(1);
});

// Reemplazar línea 207 y siguientes
// Envolver en IIFE para no contaminar el alcance global
(function() {
    const anteriorBtn = document.getElementById('anterior');
    const siguienteBtn = document.getElementById('siguiente');

    if (anteriorBtn) {
        anteriorBtn.addEventListener('click', () => {
            if (paginaActual > 1) {
                paginaActual--;
                cargarResultados(paginaActual);
            }
        });
    }

    if (siguienteBtn) {
        siguienteBtn.addEventListener('click', () => {
            if (paginaActual < totalPaginas) {
                paginaActual++;
                cargarResultados(paginaActual);
            }
        });
    }
})();

// CARGAR ESTADISTICAS INICIALES
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
// SECCION DE COMPARACION
// Función para mostrar toast
function mostrarToast(mensaje, duracion = 5000) {
    const toast = document.getElementById('toast-notification');
    const mensajeElement = document.getElementById('toast-message');
    
    mensajeElement.textContent = mensaje;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duracion);
}

function compararCarreras() {
    const carrera1 = document.getElementById('carrera1-select').value;
    const carrera2 = document.getElementById('carrera2-select').value;
    
    if (!carrera1 || !carrera2) {
        mostrarToast('Selecciona dos carreras para comparar');
        return;
    }

    fetch(`/Sistema-universidad/comparacion_carreras.php?carrera1=${encodeURIComponent(carrera1)}&carrera2=${encodeURIComponent(carrera2)}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                throw new Error(data.mensaje || 'Error al obtener los datos');
            }
            actualizarGraficoComparacion(data);
            actualizarEstadisticas(data);
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarToast('Error al obtener los datos de comparación: ' + error.message);
        });
}

// Función para actualizar el gráfico de comparación
function actualizarGraficoComparacion(data) {
    const ctx = document.getElementById('comparacionPuntajes').getContext('2d');
    
    if (window.comparacionChart) {
        window.comparacionChart.destroy();
    }
    
    window.comparacionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Lectura Crítica', 'Matemáticas', 'Ciencias', 'Sociales', 'Inglés'],
            datasets: [
                {
                    label: data.carrera1.nombre,
                    data: data.carrera1.puntajes,
                    backgroundColor: 'rgba(76, 175, 80, 0.7)',
                    borderColor: '#4CAF50',
                    borderWidth: 2,
                    borderRadius: 5,
                    hoverBackgroundColor: 'rgba(76, 175, 80, 0.9)'
                },
                {
                    label: data.carrera2.nombre,
                    data: data.carrera2.puntajes,
                    backgroundColor: 'rgba(33, 150, 243, 0.7)',
                    borderColor: '#2196F3',
                    borderWidth: 2,
                    borderRadius: 5,
                    hoverBackgroundColor: 'rgba(33, 150, 243, 0.9)'
                }
            ]
        },
        options: {
            responsive: true,
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 20,
                        font: {
                            size: 13
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Comparación de Puntajes por Área',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// Función para formatear números
function formatearNumero(numero) {
    // Si el número es entero (como el total de estudiantes)
    if (Number.isInteger(Number(numero))) {
        return new Intl.NumberFormat('es-CO').format(numero);
    }
    // Si el número tiene decimales (como los promedios)
    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(numero);
}

// Función para actualizar estadísticas con animación
function actualizarEstadisticas(data) {
    const elementos = [
        {
            id: 'promedio-carrera1',
            valor: data.carrera1.promedio_global,
            nombre: data.carrera1.nombre,
            esPromedio: true
        },
        {
            id: 'promedio-carrera2',
            valor: data.carrera2.promedio_global,
            nombre: data.carrera2.nombre,
            esPromedio: true
        },
        {
            id: 'estudiantes-carrera1',
            valor: data.carrera1.total_estudiantes,
            nombre: data.carrera1.nombre,
            esPromedio: false
        },
        {
            id: 'estudiantes-carrera2',
            valor: data.carrera2.total_estudiantes,
            nombre: data.carrera2.nombre,
            esPromedio: false
        }
    ];

    elementos.forEach(({id, valor, nombre, esPromedio}) => {
        const elemento = document.getElementById(id);
        elemento.classList.add('loading');
        
        setTimeout(() => {
            elemento.innerHTML = `
                <div class="value-label">${nombre}</div>
                <div class="value-number">${formatearNumero(valor)}${esPromedio ? '%' : ''}</div>
            `;
            elemento.classList.remove('loading');
            elemento.classList.add('updated');
            
            setTimeout(() => {
                elemento.classList.remove('updated');
            }, 500);
        }, 300);
    });
}

// Asegurarse de que Chart.js esté cargado antes de usar
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si Chart está disponible
    if (typeof Chart === 'undefined') {
        console.error('Chart.js no está cargado. Por favor, verifica la inclusión de la biblioteca.');
    }
});