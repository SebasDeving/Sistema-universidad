<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Info - Pruebas Pro</title>
    <link rel="icon" href="assets/img/icon.png" type="image/x-icon">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <link rel="stylesheet" href="assets/CSS/estilos-index.css?v=36735">
    <script async src="assets/js/script-index.js?v=3675"></script>
</head>
<body>
    <div class="container animate__animated animate__fadeIn" style="margin-left: 4em;">
        <div class="logo-container animate__animated animate__bounceInDown">
            <img src="assets/img/logo.png" alt="Logo Pruebas Pro" style="margin-left: -3em;" class="logo">
        </div>
        
        <h1 class="animate__animated animate__fadeInUp">Sistema de Información Pruebas Pro</h1>
        
        <div class="tab-container animate__animated animate__fadeInUp animate__delay-1s">
            <div class="tab active" onclick="changeTab('estudiante')">
                <i class="fas fa-user-graduate"></i>
                <span>Estudiante</span>
            </div>
            <div class="tab" onclick="changeTab('admin')">
                <i class="fas fa-user-shield"></i>
                <span>Administrador</span>
            </div>
        </div>
        
        <!-- Formulario de Estudiantes -->
        <div class="form-content active animate__animated animate__fadeIn" id="estudiante-form">
            <form id="estudiante-login" action="consulta-estudiantes.php" method="POST" class="glass-form">
                <div class="form-group">
                    <label for="cedula_estudiantes">Cédula Estudiante:</label>
                    <input type="text" id="cedula_estudiantes" name="cedula_estudiante" 
                           required pattern="[0-9]{7,10}" class="modern-input"
                           placeholder="Ingresa tu cédula">
                </div>
                <button type="submit" class="modern-button">
                    <span>Ver Resultados</span>
                    <i class="fas fa-arrow-right"></i>
                </button>
                <?php
                session_start();
                if (isset($_SESSION["errorcedula_message"])) {
                    echo "<div class='message message_error animate__animated animate__shakeX'>" . 
                         $_SESSION["errorcedula_message"] . "</div>";
                    unset($_SESSION["errorcedula_message"]);
                }
                ?>
            </form>
        </div>
        
        <!-- Formulario de Administrador -->
        <div class="form-content animate__animated animate__fadeIn" id="admin-form">
            <form id="admin-login" action="login.php" method="POST" class="glass-form">
                <div class="form-group">
                    <label for="cedula_admin">Cédula Administrador:</label>
                    <input type="text" id="cedula_admin" name="cedula_admin" 
                           required pattern="[0-9]{7,10}" class="modern-input"
                           placeholder="Ingresa tu cédula">
                    <small class="error-message" id="cedula-error">Cédula inválida</small>
                </div>
                <div class="form-group">
                    <label for="password_admin">Contraseña:</label>
                    <div class="password-container">
                        <input type="password" id="password_admin" name="password_admin" 
                               required minlength="6" class="modern-input"
                               placeholder="Ingresa tu contraseña">
                        <i class=" toggle-password" onclick="togglePassword()"></i>
                    </div>
                    <small class="error-message" id="password-error">Mínimo 6 caracteres</small>
                </div>
                <button type="submit" class="modern-button">
                    <span>Iniciar Sesión</span>
                    <i class="fas fa-sign-in-alt"></i>
                </button>
                <?php
                if (isset($_SESSION["error_message"])) {
                    echo "<div class='message message_error animate__animated animate__shakeX'>" . 
                         $_SESSION["error_message"] . "</div>";
                    unset($_SESSION["error_message"]);
                }
                ?>
            </form>
        </div>
    </div>

    <!-- Agregar Font Awesome para los iconos -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</body>
</html>

