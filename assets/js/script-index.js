function changeTab(tab) {
    // Quitar la clase 'active' de todos los tabs y formularios
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.form-content').forEach(f => f.classList.remove('active'));

    // Agregar la clase 'active' al tab seleccionado y su formulario correspondiente
    document.querySelector(`.tab[onclick="changeTab('${tab}')"]`).classList.add('active');
    document.getElementById(`${tab}-form`).classList.add('active');


}




