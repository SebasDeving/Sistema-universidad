<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Info - Pruebas Pro</title>
    <link rel="icon" href="assets/img/icon.png" type="image/x-icon">
    <link rel="stylesheet" href="assets/CSS/estilos-index.css">
    <script async src="assets/js/script-index.js"></script>
</head>
<body>
    <div class="container">
        <img src="assets/img/logo.png" alt="Descripción de la imagen" style="max-width: 100%; height: auto;">
        <h1>Sistema de Información Pruebas Pro</h1>
        
        <div class="tab-container">
            <div class="tab active" onclick="changeTab('estudiante')">Estudiante</div>
            <div class="tab" onclick="changeTab('admin')">Administrador</div>
        </div>
        
        <!-- Formulario de Estudiantes -->
        <div class="form-content active" id="estudiante-form">
            <form id="estudiante-login" action="consulta-estudiantes.php" method="POST">
                <div class="form-group">
                    <label for="cedula_estudiantes">Cédula Estudiante:</label>
                    <input type="text" id="cedula_estudiantes" name="cedula_estudiante" required pattern="[0-9]{7,10}">
                </div>
                <button type="submit">Ver Resultados</button>
                <?php
                session_start();
                if (isset($_SESSION["errorcedula_message"])) {
                    echo "<div class='message message_error'>" . $_SESSION["errorcedula_message"] . "</div>";
                    unset($_SESSION["errorcedula_message"]); // Eliminar el mensaje de error después de mostrarlo
                }
                if (isset($_SESSION["errorcedula_message"])) {
                    echo "<div class='message message_error'>" . $_SESSION["errorcedula_message"] . "</div>";
                    unset($_SESSION["errorcedula_message"]); // Eliminar el mensaje de error después de mostrarlo
                }
                ?>
            </form>
        </div>
        
        <div class="form-content" id="admin-form">
            <form id="admin-login" action="login.php" method="POST">
                <div class="form-group">
                    <label for="cedula_admin">Cédula Administrador:</label>
                    <input type="text" id="cedula_admin" name="cedula_admin" required pattern="[0-9]{7,10}">
                    <small class="error-message" id="cedula-error" style="display:none; color: red;">Cédula inválida</small>
                </div>
                <div class="form-group">
                    <label for="password_admin">Contraseña:</label>
                    <input type="password" id="password_admin" name="password_admin" required minlength="6">
                    <small class="error-message" id="password-error" style="display:none; color: red;">Mínimo 6 caracteres</small>
                </div>
                <button type="submit">Iniciar Sesión</button>
                <?php
                if (isset($_SESSION["error_message"])) {
                    echo "<div class='message message_error'>" . $_SESSION["error_message"] . "</div>";
                    unset($_SESSION["error_message"]); // Eliminar el mensaje de error después de mostrarlo
                }
                if (isset($_SESSION["success_message"])) {
                    echo "<div class='message message_success'>" . $_SESSION["success_message"] . "</div>";
                    unset($_SESSION["success_message"]); // Eliminar el mensaje de éxito después de mostrarlo
                }
                ?>
                <div class="error-message" id="admin-error" style="display:none; color: red;">Credenciales incorrectas</div>
            </form>
        </div>
    </div>
</body>
</html>

