<?php
class Estudiante
{
   
   private $nombre;
   private $apellido;
   private $cedula;

   function __construct( $nombre, $apellido, $cedula)
   {

      $this->nombre = $nombre;
      $this->apellido = $apellido;
      $this->cedula = $cedula;
   }

   public function setNombre($nombre)
   {
      $this->nombre = $nombre;
   }
   public function getNombre()
   {
      return $this->nombre;
   }
   public function setApellido($apellido)
   {
      $this->apellido = $apellido;
   }
   public function getApellido()
   {
      return $this->apellido;
   }
   public function setCedula($cedula)
   {
      $this->cedula = $cedula;
   }
   public function getCedula()
   {
      return $this->cedula;
   }
}
?>