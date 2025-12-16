-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: museo_quiz
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'd2ecf30a-c628-11f0-9821-14ac60240e96:1-657';

--
-- Table structure for table `administradores`
--

DROP TABLE IF EXISTS `administradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administradores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('admin','super_admin','editor') COLLATE utf8mb4_unicode_ci DEFAULT 'admin',
  `activo` tinyint(1) DEFAULT '1',
  `ultimo_acceso` timestamp NULL DEFAULT NULL,
  `intentos_fallidos` int DEFAULT '0',
  `bloqueado_hasta` timestamp NULL DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_activo` (`activo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administradores`
--

LOCK TABLES `administradores` WRITE;
/*!40000 ALTER TABLE `administradores` DISABLE KEYS */;
INSERT INTO `administradores` VALUES (5,'Administrador Museo','admin@museo.cl','$2b$10$RmJze0gruXLcYldt/lVimeo12BVwTYhlhsJ36QVBSUXcd9LlFFWmm','admin',1,NULL,0,NULL,'2025-12-09 21:28:51',NULL);
/*!40000 ALTER TABLE `administradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `codigos_qr`
--

DROP TABLE IF EXISTS `codigos_qr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `codigos_qr` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quiz_id` int NOT NULL,
  `codigo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url_qr` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `ubicacion` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `veces_escaneado` int DEFAULT '0',
  `ultimo_escaneo` timestamp NULL DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_expiracion` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  KEY `idx_codigo` (`codigo`),
  KEY `idx_activo` (`activo`),
  KEY `idx_quiz` (`quiz_id`),
  CONSTRAINT `codigos_qr_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `codigos_qr`
--

LOCK TABLES `codigos_qr` WRITE;
/*!40000 ALTER TABLE `codigos_qr` DISABLE KEYS */;
INSERT INTO `codigos_qr` VALUES (1,1,'FLORA-BIOBIO-2024',NULL,'Código QR principal para quiz de Flora','Entrada principal del museo',1,0,NULL,'2025-12-06 16:31:14',NULL),(2,1,'QUIZ-1-1765416686493','http://localhost:5173/quiz/1/registro',NULL,NULL,1,0,NULL,'2025-12-11 01:31:26',NULL),(3,1,'QUIZ-1-1765426321514','http://localhost:5173/quiz/1/registro',NULL,NULL,1,0,NULL,'2025-12-11 04:12:01',NULL),(4,1,'QUIZ-1-1765426356722','http://localhost:5173/quiz/1/registro',NULL,NULL,1,0,NULL,'2025-12-11 04:12:36',NULL);
/*!40000 ALTER TABLE `codigos_qr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs_auditoria`
--

DROP TABLE IF EXISTS `logs_auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs_auditoria` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tabla_afectada` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `accion` enum('INSERT','UPDATE','DELETE','LOGIN','LOGOUT','ERROR') COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_id` int DEFAULT NULL,
  `admin_id` int DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `datos_anteriores` json DEFAULT NULL,
  `datos_nuevos` json DEFAULT NULL,
  `fecha_accion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tabla` (`tabla_afectada`),
  KEY `idx_accion` (`accion`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `idx_admin` (`admin_id`),
  KEY `idx_fecha` (`fecha_accion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs_auditoria`
--

LOCK TABLES `logs_auditoria` WRITE;
/*!40000 ALTER TABLE `logs_auditoria` DISABLE KEYS */;
/*!40000 ALTER TABLE `logs_auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preguntas`
--

DROP TABLE IF EXISTS `preguntas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preguntas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quiz_id` int NOT NULL,
  `texto_pregunta` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `imagen_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orden` int DEFAULT '1',
  `puntos` int DEFAULT '10',
  `tiempo_limite_segundos` int DEFAULT '30',
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_quiz_orden` (`quiz_id`,`orden`),
  KEY `idx_activo` (`activo`),
  CONSTRAINT `preguntas_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preguntas`
--

LOCK TABLES `preguntas` WRITE;
/*!40000 ALTER TABLE `preguntas` DISABLE KEYS */;
INSERT INTO `preguntas` VALUES (1,1,'¿Cuál es el árbol nativo más común en la región del Biobío?',NULL,1,10,30,1),(2,1,'¿Qué especie de ave es característica de los bosques del Biobío?',NULL,2,10,30,1),(3,1,'¿Cuántos kilómetros tiene aproximadamente el río Biobío?',NULL,3,10,30,1);
/*!40000 ALTER TABLE `preguntas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quizzes`
--

DROP TABLE IF EXISTS `quizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quizzes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `imagen_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duracion_minutos` int DEFAULT '5',
  `nivel_dificultad` enum('facil','medio','dificil') COLLATE utf8mb4_unicode_ci DEFAULT 'medio',
  `categoria` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `creado_por` int DEFAULT NULL,
  `veces_jugado` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_activo` (`activo`),
  KEY `idx_categoria` (`categoria`),
  KEY `idx_nivel` (`nivel_dificultad`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
INSERT INTO `quizzes` VALUES (1,'Flora del Biobío','Descubre la biodiversidad de plantas nativas del Biobío y aprende sobre la flora característica de nuestra región.',NULL,5,'medio','Flora y Fauna',1,'2025-12-06 16:31:14','2025-12-11 03:47:06',NULL,5);
/*!40000 ALTER TABLE `quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ranking`
--

DROP TABLE IF EXISTS `ranking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ranking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sesion_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `quiz_id` int NOT NULL,
  `puntaje` int NOT NULL,
  `tiempo_segundos` int NOT NULL,
  `posicion` int DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_sesion_ranking` (`sesion_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `idx_quiz_posicion` (`quiz_id`,`posicion`),
  KEY `idx_puntaje` (`puntaje` DESC),
  KEY `idx_fecha` (`fecha_registro`),
  CONSTRAINT `ranking_ibfk_1` FOREIGN KEY (`sesion_id`) REFERENCES `sesiones_quiz` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ranking_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ranking_ibfk_3` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ranking`
--

LOCK TABLES `ranking` WRITE;
/*!40000 ALTER TABLE `ranking` DISABLE KEYS */;
INSERT INTO `ranking` VALUES (1,1,1,1,30,145,3,'2025-12-06 16:31:14'),(2,2,2,1,20,180,8,'2025-12-06 16:31:14'),(3,3,3,1,30,165,4,'2025-12-06 16:31:14'),(4,4,4,1,10,200,18,'2025-12-06 16:31:14'),(5,5,5,1,20,190,9,'2025-12-06 16:31:14'),(6,7,7,1,10,24,16,'2025-12-06 23:56:41'),(7,9,7,1,0,300,21,'2025-12-07 00:07:43'),(8,11,7,1,0,300,22,'2025-12-07 00:40:13'),(9,13,7,1,10,157,17,'2025-12-07 01:24:53'),(10,15,7,1,20,11,5,'2025-12-07 01:25:50'),(11,17,7,1,20,13,6,'2025-12-07 19:36:41'),(12,29,7,1,30,10,2,'2025-12-07 21:04:26'),(13,33,6,1,10,11,14,'2025-12-07 21:44:28'),(14,35,6,1,10,8,12,'2025-12-07 21:44:57'),(15,51,6,1,10,300,19,'2025-12-09 19:24:19'),(16,54,7,1,10,15,15,'2025-12-10 00:13:37'),(17,61,9,1,10,6,10,'2025-12-10 00:28:58'),(18,65,8,1,10,9,13,'2025-12-10 17:42:33'),(19,66,6,1,20,17,7,'2025-12-11 02:17:43'),(20,77,6,1,0,31,20,'2025-12-11 03:21:44'),(21,79,6,1,10,7,11,'2025-12-11 03:25:33'),(22,81,7,1,30,5,1,'2025-12-11 03:47:06');
/*!40000 ALTER TABLE `ranking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `respuestas`
--

DROP TABLE IF EXISTS `respuestas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `respuestas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pregunta_id` int NOT NULL,
  `texto_respuesta` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `es_correcta` tinyint(1) DEFAULT '0',
  `orden` int DEFAULT '1',
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_pregunta_respuesta` (`pregunta_id`,`texto_respuesta`),
  KEY `idx_pregunta_orden` (`pregunta_id`,`orden`),
  KEY `idx_correcta` (`es_correcta`),
  CONSTRAINT `respuestas_ibfk_1` FOREIGN KEY (`pregunta_id`) REFERENCES `preguntas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respuestas`
--

LOCK TABLES `respuestas` WRITE;
/*!40000 ALTER TABLE `respuestas` DISABLE KEYS */;
INSERT INTO `respuestas` VALUES (1,1,'Araucaria',1,1,1),(2,1,'Eucalipto',0,2,1),(3,1,'Pino',0,3,1),(4,1,'Álamo',0,4,1),(5,2,'Cóndor',0,1,1),(6,2,'Chucao',1,2,1),(7,2,'Loro tricahue',0,3,1),(8,2,'Carpintero negro',0,4,1),(9,3,'150 km',0,1,1),(10,3,'240 km',0,2,1),(11,3,'380 km',1,3,1),(12,3,'500 km',0,4,1);
/*!40000 ALTER TABLE `respuestas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sesiones_quiz`
--

DROP TABLE IF EXISTS `sesiones_quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sesiones_quiz` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `quiz_id` int NOT NULL,
  `puntaje_total` int DEFAULT '0',
  `respuestas_correctas` int DEFAULT '0',
  `respuestas_incorrectas` int DEFAULT '0',
  `tiempo_total_segundos` int DEFAULT NULL,
  `porcentaje_acierto` decimal(5,2) DEFAULT NULL,
  `completado` tinyint(1) DEFAULT '0',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `fecha_inicio` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_fin` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `idx_quiz` (`quiz_id`),
  KEY `idx_completado` (`completado`),
  KEY `idx_fecha_inicio` (`fecha_inicio`),
  KEY `idx_puntaje` (`puntaje_total`),
  CONSTRAINT `sesiones_quiz_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sesiones_quiz_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sesiones_quiz`
--

LOCK TABLES `sesiones_quiz` WRITE;
/*!40000 ALTER TABLE `sesiones_quiz` DISABLE KEYS */;
INSERT INTO `sesiones_quiz` VALUES (1,1,1,30,3,0,145,NULL,1,'192.168.1.100',NULL,'2025-12-06 16:31:14','2025-12-06 16:31:14'),(2,2,1,20,2,1,180,NULL,1,'192.168.1.101',NULL,'2025-12-06 16:31:14','2025-12-06 16:31:14'),(3,3,1,30,3,0,165,NULL,1,'192.168.1.102',NULL,'2025-12-06 16:31:14','2025-12-06 16:31:14'),(4,4,1,10,1,2,200,NULL,1,'192.168.1.103',NULL,'2025-12-06 16:31:14','2025-12-06 16:31:14'),(5,5,1,20,2,1,190,NULL,1,'192.168.1.104',NULL,'2025-12-06 16:31:14','2025-12-06 16:31:14'),(6,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-06 23:56:16',NULL),(7,7,1,10,1,2,24,NULL,1,NULL,NULL,'2025-12-06 23:56:16','2025-12-06 23:56:41'),(8,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 00:02:36',NULL),(9,7,1,0,0,3,300,NULL,1,NULL,NULL,'2025-12-07 00:02:36','2025-12-07 00:07:43'),(10,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 00:35:07',NULL),(11,7,1,0,0,3,300,NULL,1,NULL,NULL,'2025-12-07 00:35:07','2025-12-07 00:40:13'),(12,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 01:22:14',NULL),(13,7,1,10,1,2,157,NULL,1,NULL,NULL,'2025-12-07 01:22:14','2025-12-07 01:24:53'),(14,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 01:25:39',NULL),(15,7,1,20,2,1,11,NULL,1,NULL,NULL,'2025-12-07 01:25:39','2025-12-07 01:25:50'),(16,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 19:36:27',NULL),(17,7,1,20,2,1,13,NULL,1,NULL,NULL,'2025-12-07 19:36:27','2025-12-07 19:36:41'),(18,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 19:49:04',NULL),(19,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 19:49:04',NULL),(20,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 20:03:54',NULL),(21,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 20:03:54',NULL),(22,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 20:41:49',NULL),(23,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 20:41:49',NULL),(24,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 20:45:48',NULL),(25,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 20:45:48',NULL),(26,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 21:02:19',NULL),(27,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 21:02:19',NULL),(28,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 21:04:15',NULL),(29,7,1,30,3,0,10,NULL,1,NULL,NULL,'2025-12-07 21:04:15','2025-12-07 21:04:25'),(30,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 21:09:50',NULL),(31,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 21:09:50',NULL),(32,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 21:44:16',NULL),(33,6,1,10,1,2,11,NULL,1,NULL,NULL,'2025-12-07 21:44:16','2025-12-07 21:44:28'),(34,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 21:44:48',NULL),(35,6,1,10,1,2,8,NULL,1,NULL,NULL,'2025-12-07 21:44:48','2025-12-07 21:44:57'),(36,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 21:45:31',NULL),(37,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 21:45:31',NULL),(38,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 21:45:35',NULL),(39,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-07 21:45:35',NULL),(40,8,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-09 16:31:11',NULL),(41,8,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-09 16:31:11',NULL),(42,9,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-09 16:31:31',NULL),(43,9,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-09 16:31:31',NULL),(44,10,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-09 17:00:43',NULL),(45,10,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-09 17:00:43',NULL),(46,10,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-09 19:08:22',NULL),(47,10,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-09 19:08:22',NULL),(48,11,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-09 19:09:46',NULL),(49,11,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-09 19:09:46',NULL),(50,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-09 19:19:15',NULL),(51,6,1,10,1,2,300,NULL,1,NULL,NULL,'2025-12-09 19:19:15','2025-12-09 19:24:19'),(52,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-09 19:32:14',NULL),(53,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-09 19:32:14',NULL),(54,7,1,10,1,2,15,NULL,1,NULL,NULL,'2025-12-10 00:13:22','2025-12-10 00:13:37'),(55,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-10 00:13:22',NULL),(56,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-10 00:15:18',NULL),(57,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-10 00:15:18',NULL),(58,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-10 00:15:25',NULL),(59,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-10 00:15:25',NULL),(60,9,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-10 00:28:52',NULL),(61,9,1,10,1,2,6,NULL,1,NULL,NULL,'2025-12-10 00:28:52','2025-12-10 00:28:58'),(62,9,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-10 00:31:42',NULL),(63,9,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-10 00:31:42',NULL),(64,8,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-10 17:42:24',NULL),(65,8,1,10,1,2,9,NULL,1,NULL,NULL,'2025-12-10 17:42:24','2025-12-10 17:42:33'),(66,6,1,20,2,1,17,NULL,1,NULL,NULL,'2025-12-11 02:17:26','2025-12-11 02:17:43'),(67,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-11 02:17:26',NULL),(68,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-11 03:00:04',NULL),(69,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-11 03:00:04',NULL),(70,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-11 03:16:49',NULL),(71,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-11 03:16:49',NULL),(72,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-11 03:18:27',NULL),(73,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-11 03:18:27',NULL),(74,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-11 03:18:29',NULL),(75,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-11 03:18:29',NULL),(76,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-11 03:21:12',NULL),(77,6,1,0,0,3,31,NULL,1,NULL,NULL,'2025-12-11 03:21:12','2025-12-11 03:21:44'),(78,6,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-11 03:25:25',NULL),(79,6,1,10,1,2,7,NULL,1,NULL,NULL,'2025-12-11 03:25:25','2025-12-11 03:25:33'),(80,7,1,0,0,0,NULL,NULL,0,NULL,NULL,'2025-12-11 03:47:00',NULL),(81,7,1,30,3,0,5,NULL,1,NULL,NULL,'2025-12-11 03:47:00','2025-12-11 03:47:06');
/*!40000 ALTER TABLE `sesiones_quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `edad` int DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ciudad` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ultima_actividad` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_fecha_registro` (`fecha_registro`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'María González','maria.gonzalez@ejemplo.cl',25,NULL,'Concepción','2025-12-06 16:31:14',NULL,1),(2,'Pedro Martínez','pedro.martinez@ejemplo.cl',32,NULL,'Los Ángeles','2025-12-06 16:31:14',NULL,1),(3,'Ana López','ana.lopez@ejemplo.cl',28,NULL,'Chillán','2025-12-06 16:31:14',NULL,1),(4,'Carlos Rojas','carlos.rojas@ejemplo.cl',35,NULL,'Concepción','2025-12-06 16:31:14',NULL,1),(5,'Sofía Vargas','sofia.vargas@ejemplo.cl',22,NULL,'Los Ángeles','2025-12-06 16:31:14',NULL,1),(6,'Matias',NULL,NULL,NULL,NULL,'2025-12-06 17:34:26',NULL,1),(7,'eve',NULL,NULL,NULL,NULL,'2025-12-06 23:56:16',NULL,1),(8,'Luisa',NULL,NULL,NULL,NULL,'2025-12-09 16:31:11',NULL,1),(9,'luis',NULL,NULL,NULL,NULL,'2025-12-09 16:31:31',NULL,1),(10,'EstoEsUnNombreMuyLar',NULL,NULL,NULL,NULL,'2025-12-09 17:00:43',NULL,1),(11,'maria',NULL,NULL,NULL,NULL,'2025-12-09 19:09:46',NULL,1);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-
-- Procedimiento almacenado para actualizar posiciones del ranking
--

DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_actualizar_posiciones_ranking`$$

CREATE PROCEDURE `sp_actualizar_posiciones_ranking`(IN p_quiz_id INT)
BEGIN
    -- Variable para contador de posición
    SET @posicion := 0;
    
    -- Actualizar posiciones ordenando por puntaje DESC, tiempo ASC
    UPDATE ranking r
    INNER JOIN (
        SELECT 
            id,
            (@posicion := @posicion + 1) AS nueva_posicion
        FROM ranking
        WHERE quiz_id = p_quiz_id
        ORDER BY puntaje DESC, tiempo_segundos ASC
    ) AS subquery ON r.id = subquery.id
    SET r.posicion = subquery.nueva_posicion
    WHERE r.quiz_id = p_quiz_id;
    
END$$

DELIMITER ;

--
-- Trigger que actualiza el ranking automáticamente al finalizar una sesión
--

DELIMITER $$

DROP TRIGGER IF EXISTS `after_sesion_completada`$$

CREATE TRIGGER `after_sesion_completada`
AFTER UPDATE ON `sesiones_quiz`
FOR EACH ROW
BEGIN
    -- Solo ejecutar si la sesión cambió de incompleta a completada
    IF OLD.completado = 0 AND NEW.completado = 1 THEN
        
        -- Insertar registro en tabla ranking si no existe
        INSERT INTO ranking (
            sesion_id, 
            usuario_id, 
            quiz_id, 
            puntaje, 
            tiempo_segundos,
            fecha_registro
        ) VALUES (
            NEW.id,
            NEW.usuario_id,
            NEW.quiz_id,
            NEW.puntaje_total,
            NEW.tiempo_total_segundos,
            NOW()
        )
        ON DUPLICATE KEY UPDATE
            puntaje = NEW.puntaje_total,
            tiempo_segundos = NEW.tiempo_total_segundos;

        -- Actualizar posiciones del ranking para este quiz
        CALL sp_actualizar_posiciones_ranking(NEW.quiz_id);

    END IF;
END$$

DELIMITER ;

-- Dump completed on 2025-12-11 11:40:09
