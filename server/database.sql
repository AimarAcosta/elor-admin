-- =====================================================
-- EDUELORRIETA - Script de Base de Datos MySQL/MariaDB
-- Base de datos real del proyecto
-- =====================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS `eduelorrieta`
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE `eduelorrieta`;

-- =====================================================
-- TABLA: tipos (roles de usuario)
-- =====================================================
CREATE TABLE `tipos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `name_eu` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `tipos` (`id`, `name`, `name_eu`) VALUES
(1, 'god', 'jainkoa'),
(2, 'administrador', 'administratzailea'),
(3, 'profesor', 'irakaslea'),
(4, 'alumno', 'ikaslea');

-- =====================================================
-- TABLA: ciclos (ciclos formativos)
-- =====================================================
CREATE TABLE `ciclos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `ciclos` (`id`, `nombre`) VALUES
(1, 'DAM'),
(2, 'DAW'),
(3, 'ASIR'),
(4, 'SMR'),
(5, 'OTROS');

-- =====================================================
-- TABLA: users (usuarios del sistema)
-- =====================================================
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellidos` varchar(255) DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono1` varchar(20) DEFAULT NULL,
  `telefono2` varchar(20) DEFAULT NULL,
  `argazkia_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tipo_id` (`tipo_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`tipo_id`) REFERENCES `tipos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Usuarios de prueba (contraseña: 123456)
INSERT INTO `users` (`id`, `tipo_id`, `username`, `password`, `email`, `nombre`, `apellidos`, `dni`, `direccion`, `telefono1`, `telefono2`, `argazkia_url`) VALUES
(1, 1, 'god', '123456', 'god@elorrieta.eus', 'Jainkoa', 'Sistema', '00000000A', 'Elorrieta', '600000000', NULL, NULL),
(2, 2, 'admin', '123456', 'admin@elorrieta.eus', 'Admin', 'Elorrieta', '11111111B', 'Bilbao', '600000001', NULL, NULL),
(3, 3, 'profe1', '123456', 'profe1@elorrieta.eus', 'Profesor', 'García López', '22222222C', 'Bilbao', '600000002', '944000001', NULL),
(4, 3, 'profe2', '123456', 'profe2@elorrieta.eus', 'Profesora', 'Martínez Ruiz', '33333333D', 'Getxo', '600000003', NULL, NULL),
(5, 4, 'alumno1', '123456', 'alumno1@elorrieta.eus', 'Alumno', 'Fernández Pérez', '44444444E', 'Barakaldo', '600000004', NULL, NULL),
(6, 4, 'alumno2', '123456', 'alumno2@elorrieta.eus', 'Alumna', 'González Sánchez', '55555555F', 'Portugalete', '600000005', NULL, NULL),
(7, 4, 'alumno3', '123456', 'alumno3@elorrieta.eus', 'Estudiante', 'López Torres', '66666666G', 'Santurtzi', '600000006', NULL, NULL);

-- =====================================================
-- TABLA: modulos (asignaturas)
-- =====================================================
CREATE TABLE `modulos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `nombre_eus` varchar(255) NOT NULL,
  `horas` int(11) NOT NULL,
  `ciclo_id` int(11) NOT NULL,
  `curso` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ciclo_id` (`ciclo_id`),
  CONSTRAINT `modulos_ibfk_1` FOREIGN KEY (`ciclo_id`) REFERENCES `ciclos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `modulos` (`id`, `nombre`, `nombre_eus`, `horas`, `ciclo_id`, `curso`) VALUES
(1, 'Sistemas informáticos', 'Sistema informatikoak', 6, 1, 1),
(2, 'Base de datos', 'Datu-baseak', 6, 1, 1),
(3, 'Programación', 'Programazioa', 8, 1, 1),
(4, 'Lenguajes de marcas', 'Marka-lengoaiak', 4, 1, 1),
(5, 'Entornos de desarrollo', 'Garapen-inguruneak', 3, 1, 1),
(6, 'Acceso a datos', 'Datuetara sarbidea', 5, 1, 2),
(7, 'Desarrollo de interfaces', 'Interfazeen garapena', 6, 1, 2),
(8, 'Programación multimedia y móviles', 'Multimedia eta mugikorren programazioa', 5, 1, 2),
(9, 'Programación servicios y procesos', 'Zerbitzu eta prozesuen programazioa', 3, 1, 2),
(10, 'Sistemas gestión empresarial', 'Enpresa-kudeaketa sistemak', 3, 1, 2),
(11, 'Desarrollo web cliente', 'Web bezeroaren garapena', 6, 2, 2),
(12, 'Desarrollo web servidor', 'Web zerbitzariaren garapena', 8, 2, 2),
(13, 'Despliegue aplicaciones web', 'Web aplikazioen hedapena', 4, 2, 2),
(14, 'Diseño interfaces web', 'Web interfazeen diseinua', 4, 2, 2),
(15, 'Implantación sistemas operativos', 'Sistema eragileen ezarpena', 8, 3, 1),
(16, 'Planificación administración redes', 'Sareen planifikazioa eta administrazioa', 6, 3, 1),
(17, 'Fundamentos hardware', 'Hardware oinarriak', 4, 4, 1),
(18, 'Sistemas operativos monopuesto', 'Ekipo bakarreko sistema eragileak', 5, 4, 1),
(19, 'Formación y orientación laboral', 'Laneko prestakuntza eta orientazioa', 3, 5, 1);

-- =====================================================
-- TABLA: horarios (horarios de clase)
-- =====================================================
CREATE TABLE `horarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dia` enum('LUNES','MARTES','MIERCOLES','JUEVES','VIERNES') NOT NULL,
  `hora` int(11) NOT NULL,
  `profe_id` int(11) NOT NULL,
  `modulo_id` int(11) NOT NULL,
  `aula` varchar(50) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_horario` (`dia`,`hora`,`aula`),
  KEY `profe_id` (`profe_id`),
  KEY `modulo_id` (`modulo_id`),
  CONSTRAINT `horarios_ibfk_1` FOREIGN KEY (`profe_id`) REFERENCES `users` (`id`),
  CONSTRAINT `horarios_ibfk_2` FOREIGN KEY (`modulo_id`) REFERENCES `modulos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `horarios` (`id`, `dia`, `hora`, `profe_id`, `modulo_id`, `aula`, `observaciones`) VALUES
(1, 'LUNES', 1, 3, 3, 'Aula B101', 'Programación'),
(2, 'LUNES', 2, 3, 3, 'Aula B101', 'Programación'),
(3, 'LUNES', 3, 3, 2, 'Aula B102', 'Base de datos'),
(4, 'MARTES', 1, 3, 3, 'Aula B101', 'Programación'),
(5, 'MARTES', 2, 3, 1, 'Aula B103', 'Sistemas'),
(6, 'MIERCOLES', 1, 4, 11, 'Aula A201', 'Desarrollo web cliente'),
(7, 'MIERCOLES', 2, 4, 12, 'Aula A201', 'Desarrollo web servidor'),
(8, 'JUEVES', 1, 3, 5, 'Aula B101', 'Entornos desarrollo'),
(9, 'JUEVES', 2, 4, 14, 'Aula A202', 'Diseño interfaces'),
(10, 'VIERNES', 1, 3, 4, 'Aula B101', 'Lenguajes de marcas');

-- =====================================================
-- TABLA: reuniones (citas/bilerak)
-- =====================================================
CREATE TABLE `reuniones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `estado` enum('pendiente','aceptada','denegada') NOT NULL DEFAULT 'pendiente',
  `estado_eus` enum('zain','onartuta','ukatuta') NOT NULL DEFAULT 'zain',
  `fecha` datetime NOT NULL,
  `profesor_id` int(11) NOT NULL,
  `alumno_id` int(11) NOT NULL,
  `id_centro` varchar(20) NOT NULL DEFAULT '15112',
  `titulo` varchar(255) DEFAULT NULL,
  `asunto` text DEFAULT NULL,
  `aula` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `profesor_id` (`profesor_id`),
  KEY `alumno_id` (`alumno_id`),
  CONSTRAINT `reuniones_ibfk_1` FOREIGN KEY (`profesor_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reuniones_ibfk_2` FOREIGN KEY (`alumno_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `reuniones` (`id`, `estado`, `estado_eus`, `fecha`, `profesor_id`, `alumno_id`, `id_centro`, `titulo`, `asunto`, `aula`) VALUES
(1, 'pendiente', 'zain', '2026-01-20 09:00:00', 3, 5, '15112', 'Tutoría primer trimestre', 'Revisión de notas y progreso', 'Despacho 1'),
(2, 'aceptada', 'onartuta', '2026-01-18 10:30:00', 3, 6, '15112', 'Consulta proyecto', 'Dudas sobre el proyecto final', 'Aula B101'),
(3, 'denegada', 'ukatuta', '2026-01-15 11:00:00', 4, 5, '15112', 'Recuperación examen', 'No disponible esa fecha', NULL),
(4, 'pendiente', 'zain', '2026-01-22 12:00:00', 4, 7, '15112', 'Orientación FCT', 'Información sobre prácticas', 'Despacho 2');

-- =====================================================
-- TABLA: matriculaciones (matrículas de alumnos)
-- =====================================================
CREATE TABLE `matriculaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alum_id` int(11) NOT NULL,
  `ciclo_id` int(11) NOT NULL,
  `curso` int(11) NOT NULL,
  `fecha` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `alum_id` (`alum_id`),
  KEY `ciclo_id` (`ciclo_id`),
  CONSTRAINT `matriculaciones_ibfk_1` FOREIGN KEY (`alum_id`) REFERENCES `users` (`id`),
  CONSTRAINT `matriculaciones_ibfk_2` FOREIGN KEY (`ciclo_id`) REFERENCES `ciclos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `matriculaciones` (`id`, `alum_id`, `ciclo_id`, `curso`, `fecha`) VALUES
(1, 5, 1, 1, '2025-09-01'),
(2, 6, 1, 2, '2024-09-01'),
(3, 7, 2, 1, '2025-09-01');

COMMIT;
