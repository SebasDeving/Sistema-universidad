// Obtener el ID del estudiante de la URL
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Cargar datos del estudiante (simulado)
window.onload = function() {
    const studentId = getParameterByid('id');
    if (!studentId) {
        window.location.href = 'Estudiantes.html';
        return;
    }
    
    document.getElementById('cedula_estudiante').textContent = studentId;
    
    // Aquí normalmente cargarías datos de la base de datos
    // Por ahora simulamos un nombre basado en el ID
    const studentName = `Estudiante ${studentId}`;
    document.getElementById('nombre').textContent = studentName;
    
    // También cargarías los resultados reales del estudiante
    // Los datos mostrados son solo ejemplos estáticos
}

function logout() {
    window.location.href = 'index.php';
}