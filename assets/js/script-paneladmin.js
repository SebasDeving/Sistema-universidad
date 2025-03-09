function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    // Mostrar la sección seleccionada
    document.getElementById(sectionId).classList.add('active');
}

function logout() {
    window.location.href = 'index.html'; // Redirigir al login
}


