<?php
include 'connection.php';
require_once 'estudiante.php';

// Clase CrudEstudiante para todas las consultas con respecto al estudiante
class CrudEstudiante
{
   // Método donde se obtiene el estudiante por cedula
   public function obtenerEstudianteporCedula($cedula)
   {
      $connection = Connection::getConnection();
      if (!$connection) {
         die("Conexión fallida: " . Connection::getConnection()->connect_error);
      } else {
         // Utiliza la sintaxis correcta de mysqli para preparar y ejecutar la consulta
         $select = $connection->prepare('SELECT * FROM estudiantes WHERE cedula_estudiante = ?');
         $select->bind_param('s', $cedula);
         $select->execute();
         $result = $select->get_result();

         if ($result->num_rows > 0) {
            $estudiante = $result->fetch_assoc();
            // Asegúrate de que la clase Estudiante esté definida correctamente
            $myEstudiante = new Estudiante($estudiante['id'], $estudiante['nombre'], $estudiante['apellido'], $estudiante['cedula_estudiante']);
            return $myEstudiante;
         } else {
            return null;
         }
      }
   }
}
?>