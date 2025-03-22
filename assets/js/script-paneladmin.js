function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    // Mostrar la sección seleccionada
    document.getElementById(sectionId).classList.add('active');
}

function logout() {
    window.location.href = 'index.php'; // Redirigir al login
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


