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

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'd2ecf30a-c628-11f0-9821-14ac60240e96:1-228';

--
-- Table structure for table `administradores`
--

DROP TABLE IF EXISTS `administradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administradores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `ultimo_cambio_password` datetime(6) NOT NULL,
  `failed_login_attempts` int NOT NULL,
  `last_failed_login` datetime(6) DEFAULT NULL,
  `account_locked_until` datetime(6) DEFAULT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `last_login_ip` char(39) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_by_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `administradores_created_by_id_c9f76cb2_fk_administradores_id` (`created_by_id`),
  CONSTRAINT `administradores_created_by_id_c9f76cb2_fk_administradores_id` FOREIGN KEY (`created_by_id`) REFERENCES `administradores` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administradores`
--

LOCK TABLES `administradores` WRITE;
/*!40000 ALTER TABLE `administradores` DISABLE KEYS */;
/*!40000 ALTER TABLE `administradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add blacklisted token',7,'add_blacklistedtoken'),(26,'Can change blacklisted token',7,'change_blacklistedtoken'),(27,'Can delete blacklisted token',7,'delete_blacklistedtoken'),(28,'Can view blacklisted token',7,'view_blacklistedtoken'),(29,'Can add outstanding token',8,'add_outstandingtoken'),(30,'Can change outstanding token',8,'change_outstandingtoken'),(31,'Can delete outstanding token',8,'delete_outstandingtoken'),(32,'Can view outstanding token',8,'view_outstandingtoken'),(33,'Can add administrador',9,'add_administrador'),(34,'Can change administrador',9,'change_administrador'),(35,'Can delete administrador',9,'delete_administrador'),(36,'Can view administrador',9,'view_administrador'),(37,'Can add quiz',10,'add_quiz'),(38,'Can change quiz',10,'change_quiz'),(39,'Can delete quiz',10,'delete_quiz'),(40,'Can view quiz',10,'view_quiz'),(41,'Can add pregunta',11,'add_pregunta'),(42,'Can change pregunta',11,'change_pregunta'),(43,'Can delete pregunta',11,'delete_pregunta'),(44,'Can view pregunta',11,'view_pregunta'),(45,'Can add respuesta',12,'add_respuesta'),(46,'Can change respuesta',12,'change_respuesta'),(47,'Can delete respuesta',12,'delete_respuesta'),(48,'Can view respuesta',12,'view_respuesta'),(49,'Can add codigo qr',13,'add_codigoqr'),(50,'Can change codigo qr',13,'change_codigoqr'),(51,'Can delete codigo qr',13,'delete_codigoqr'),(52,'Can view codigo qr',13,'view_codigoqr'),(53,'Can add usuario',14,'add_usuario'),(54,'Can change usuario',14,'change_usuario'),(55,'Can delete usuario',14,'delete_usuario'),(56,'Can view usuario',14,'view_usuario'),(57,'Can add sesion quiz',15,'add_sesionquiz'),(58,'Can change sesion quiz',15,'change_sesionquiz'),(59,'Can delete sesion quiz',15,'delete_sesionquiz'),(60,'Can view sesion quiz',15,'view_sesionquiz'),(61,'Can add ranking',16,'add_ranking'),(62,'Can change ranking',16,'change_ranking'),(63,'Can delete ranking',16,'delete_ranking'),(64,'Can view ranking',16,'view_ranking'),(65,'Can add quiz',17,'add_quiz'),(66,'Can change quiz',17,'change_quiz'),(67,'Can delete quiz',17,'delete_quiz'),(68,'Can view quiz',17,'view_quiz');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$720000$mLe0wxzUkRetma1LmG7ad3$43PQYMNWAKsbdTqdmvQ8IG94fIZacixgKNRE3/HUvTI=','2025-11-23 05:48:57.984968',1,'Angostura','','','angostura@gmail.com',1,1,'2025-11-23 05:30:42.047264');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `authentication_quiz`
--

DROP TABLE IF EXISTS `authentication_quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authentication_quiz` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `tiempolimite` int NOT NULL,
  `idioma` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authentication_quiz`
--

LOCK TABLES `authentication_quiz` WRITE;
/*!40000 ALTER TABLE `authentication_quiz` DISABLE KEYS */;
/*!40000 ALTER TABLE `authentication_quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `codigos_qr`
--

DROP TABLE IF EXISTS `codigos_qr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `codigos_qr` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo_unico` char(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `fecha_desactivacion` datetime(6) DEFAULT NULL,
  `ubicacion_fisica` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numero_escaneos` int NOT NULL,
  `creado_por_id` int DEFAULT NULL,
  `quiz_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_unico` (`codigo_unico`),
  KEY `codigos_qr_creado_por_id_8bc24f6d_fk_administradores_id` (`creado_por_id`),
  KEY `codigos_qr_quiz_id_b027bcef_fk_quizzes_id` (`quiz_id`),
  CONSTRAINT `codigos_qr_creado_por_id_8bc24f6d_fk_administradores_id` FOREIGN KEY (`creado_por_id`) REFERENCES `administradores` (`id`),
  CONSTRAINT `codigos_qr_quiz_id_b027bcef_fk_quizzes_id` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `codigos_qr`
--

LOCK TABLES `codigos_qr` WRITE;
/*!40000 ALTER TABLE `codigos_qr` DISABLE KEYS */;
/*!40000 ALTER TABLE `codigos_qr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(9,'authentication','administrador'),(17,'authentication','quiz'),(5,'contenttypes','contenttype'),(13,'qr_codes','codigoqr'),(11,'quizzes','pregunta'),(10,'quizzes','quiz'),(12,'quizzes','respuesta'),(16,'ranking','ranking'),(6,'sessions','session'),(7,'token_blacklist','blacklistedtoken'),(8,'token_blacklist','outstandingtoken'),(15,'usuarios','sesionquiz'),(14,'usuarios','usuario');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-11-23 05:26:18.766723'),(2,'auth','0001_initial','2025-11-23 05:26:19.342305'),(3,'admin','0001_initial','2025-11-23 05:26:19.488425'),(4,'admin','0002_logentry_remove_auto_add','2025-11-23 05:26:19.495392'),(5,'admin','0003_logentry_add_action_flag_choices','2025-11-23 05:26:19.502664'),(6,'contenttypes','0002_remove_content_type_name','2025-11-23 05:26:19.613361'),(7,'auth','0002_alter_permission_name_max_length','2025-11-23 05:26:19.681192'),(8,'auth','0003_alter_user_email_max_length','2025-11-23 05:26:19.704174'),(9,'auth','0004_alter_user_username_opts','2025-11-23 05:26:19.711382'),(10,'auth','0005_alter_user_last_login_null','2025-11-23 05:26:19.778249'),(11,'auth','0006_require_contenttypes_0002','2025-11-23 05:26:19.781251'),(12,'auth','0007_alter_validators_add_error_messages','2025-11-23 05:26:19.787410'),(13,'auth','0008_alter_user_username_max_length','2025-11-23 05:26:19.859229'),(14,'auth','0009_alter_user_last_name_max_length','2025-11-23 05:26:19.928520'),(15,'auth','0010_alter_group_name_max_length','2025-11-23 05:26:19.945956'),(16,'auth','0011_update_proxy_permissions','2025-11-23 05:26:19.953672'),(17,'auth','0012_alter_user_first_name_max_length','2025-11-23 05:26:20.024598'),(18,'authentication','0001_initial','2025-11-23 05:26:20.116066'),(19,'quizzes','0001_initial','2025-11-23 05:26:20.323855'),(20,'qr_codes','0001_initial','2025-11-23 05:26:20.476624'),(21,'usuarios','0001_initial','2025-11-23 05:26:20.729515'),(22,'ranking','0001_initial','2025-11-23 05:26:20.826087'),(23,'sessions','0001_initial','2025-11-23 05:26:20.862785'),(24,'token_blacklist','0001_initial','2025-11-23 05:26:21.042747'),(25,'token_blacklist','0002_outstandingtoken_jti_hex','2025-11-23 05:26:21.103483'),(26,'token_blacklist','0003_auto_20171017_2007','2025-11-23 05:26:21.103483'),(27,'token_blacklist','0004_auto_20171017_2013','2025-11-23 05:26:21.189053'),(28,'token_blacklist','0005_remove_outstandingtoken_jti','2025-11-23 05:26:21.262947'),(29,'token_blacklist','0006_auto_20171017_2113','2025-11-23 05:26:21.280945'),(30,'token_blacklist','0007_auto_20171017_2214','2025-11-23 05:26:21.487510'),(31,'token_blacklist','0008_migrate_to_bigautofield','2025-11-23 05:26:21.712567'),(32,'token_blacklist','0010_fix_migrate_to_bigautofield','2025-11-23 05:26:21.715427'),(33,'token_blacklist','0011_linearizes_history','2025-11-23 05:26:21.715427'),(34,'token_blacklist','0012_alter_outstandingtoken_user','2025-11-23 05:26:21.735170'),(35,'authentication','0002_quiz','2025-11-25 23:39:08.644124'),(36,'token_blacklist','0013_alter_blacklistedtoken_options_and_more','2025-11-25 23:39:08.656732');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('axpygn4petzdr048x61ef1sutq4wak29','.eJxVjMsOwiAQRf-FtSFAy2NcuvcbyAxMpWogKe3K-O_apAvd3nPOfYmI21ri1nmJcxZnocXpdyNMD647yHestyZTq-syk9wVedAury3z83K4fwcFe_nWQMpAUokpWxz1MAWl2ZvBAAY3kudsnbGgnaPkYLKMODAoi2C08zqI9wfZ3TdJ:1vN2y1:H8UdOWg2iDXeSuVqj3Q9gDEMwQnrLhx1dBqTr703XB0','2025-12-07 05:48:57.988228');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preguntas`
--

DROP TABLE IF EXISTS `preguntas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preguntas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `texto_pregunta` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `puntaje` int NOT NULL,
  `orden` int NOT NULL,
  `quiz_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `preguntas_quiz_id_b98ae6e0_fk_quizzes_id` (`quiz_id`),
  CONSTRAINT `preguntas_quiz_id_b98ae6e0_fk_quizzes_id` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preguntas`
--

LOCK TABLES `preguntas` WRITE;
/*!40000 ALTER TABLE `preguntas` DISABLE KEYS */;
INSERT INTO `preguntas` VALUES (1,'¿Cuál es el árbol nativo más común en la región del Biobío?','multiple_choice',100,1,1),(2,'¿Qué especie de ave es característica de los bosques nativos?','multiple_choice',100,2,1),(3,'¿Cuántos kilómetros tiene aproximadamente el río Biobío?','multiple_choice',100,3,1),(4,'¿Cuál es el árbol nativo más común en la región del Biobío?','multiple_choice',100,1,2),(5,'¿Qué especie de ave es característica de los bosques nativos?','multiple_choice',100,2,2),(6,'¿Cuántos kilómetros tiene aproximadamente el río Biobío?','multiple_choice',100,3,2);
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
  `descripcion` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `tiempo_limite` int NOT NULL,
  `idioma` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `fecha_modificacion` datetime(6) NOT NULL,
  `creado_por_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `quizzes_creado_por_id_9d97396b_fk_administradores_id` (`creado_por_id`),
  CONSTRAINT `quizzes_creado_por_id_9d97396b_fk_administradores_id` FOREIGN KEY (`creado_por_id`) REFERENCES `administradores` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quizzes`
--

LOCK TABLES `quizzes` WRITE;
/*!40000 ALTER TABLE `quizzes` DISABLE KEYS */;
INSERT INTO `quizzes` VALUES (1,'Flora del Biobío','Descubre la biodiversidad de plantas nativas del río Biobío',300,'es',1,'2025-11-24 17:31:38.000000','2025-11-24 17:31:38.000000',NULL),(2,'Flora del Biobío','Descubre la biodiversidad de plantas nativas del río Biobío',300,'es',1,'2025-11-26 01:28:07.000000','2025-11-26 01:28:07.000000',NULL);
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
  `posicion` int NOT NULL,
  `fecha_actualizacion` datetime(6) NOT NULL,
  `sesion_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sesion_id` (`sesion_id`),
  CONSTRAINT `ranking_sesion_id_637ee954_fk_sesiones_quiz_id` FOREIGN KEY (`sesion_id`) REFERENCES `sesiones_quiz` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ranking`
--

LOCK TABLES `ranking` WRITE;
/*!40000 ALTER TABLE `ranking` DISABLE KEYS */;
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
  `texto_respuesta` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `es_correcta` tinyint(1) NOT NULL,
  `orden` int NOT NULL,
  `pregunta_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `respuestas_pregunta_id_17515b22_fk_preguntas_id` (`pregunta_id`),
  CONSTRAINT `respuestas_pregunta_id_17515b22_fk_preguntas_id` FOREIGN KEY (`pregunta_id`) REFERENCES `preguntas` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respuestas`
--

LOCK TABLES `respuestas` WRITE;
/*!40000 ALTER TABLE `respuestas` DISABLE KEYS */;
INSERT INTO `respuestas` VALUES (1,'Araucaria',1,1,1),(2,'Eucalipto',0,2,1),(3,'Pino',0,3,1),(4,'Álamo',0,4,1),(5,'Cóndor',0,1,2),(6,'Chucao',1,2,2),(7,'Gaviota',0,3,2),(8,'Loro',0,4,2),(9,'150 km',0,1,3),(10,'240 km',0,2,3),(11,'380 km',1,3,3),(12,'500 km',0,4,3),(13,'Araucaria',1,1,1),(14,'Eucalipto',0,2,1),(15,'Pino',0,3,1),(16,'Álamo',0,4,1),(17,'Cóndor',0,1,2),(18,'Chucao',1,2,2),(19,'Gaviota',0,3,2),(20,'Loro',0,4,2),(21,'150 km',0,1,3),(22,'240 km',0,2,3),(23,'380 km',1,3,3),(24,'500 km',0,4,3);
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
  `puntaje_obtenido` int NOT NULL,
  `puntaje_maximo` int NOT NULL,
  `tiempo_completado` int NOT NULL,
  `fecha_hora_inicio` datetime(6) NOT NULL,
  `fecha_hora_fin` datetime(6) DEFAULT NULL,
  `completado` tinyint(1) NOT NULL,
  `codigo_qr_id` int DEFAULT NULL,
  `quiz_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sesiones_quiz_codigo_qr_id_fb58b215_fk_codigos_qr_id` (`codigo_qr_id`),
  KEY `sesiones_quiz_quiz_id_26b2e82b_fk_quizzes_id` (`quiz_id`),
  KEY `sesiones_quiz_usuario_id_ea7e077e_fk_usuarios_id` (`usuario_id`),
  CONSTRAINT `sesiones_quiz_codigo_qr_id_fb58b215_fk_codigos_qr_id` FOREIGN KEY (`codigo_qr_id`) REFERENCES `codigos_qr` (`id`),
  CONSTRAINT `sesiones_quiz_quiz_id_26b2e82b_fk_quizzes_id` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`),
  CONSTRAINT `sesiones_quiz_usuario_id_ea7e077e_fk_usuarios_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sesiones_quiz`
--

LOCK TABLES `sesiones_quiz` WRITE;
/*!40000 ALTER TABLE `sesiones_quiz` DISABLE KEYS */;
INSERT INTO `sesiones_quiz` VALUES (1,300,300,120,'2025-11-22 17:31:38.000000','2025-11-22 17:31:38.000000',1,NULL,1,1),(2,200,300,180,'2025-11-23 17:31:38.000000','2025-11-23 17:31:38.000000',1,NULL,1,2),(3,100,300,240,'2025-11-24 17:31:38.000000','2025-11-24 17:31:38.000000',1,NULL,1,3),(4,0,300,0,'2025-11-26 01:18:04.000000',NULL,0,NULL,1,4),(5,100,300,26,'2025-11-26 01:18:04.000000','2025-11-26 01:18:32.000000',1,NULL,1,4);
/*!40000 ALTER TABLE `sesiones_quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_blacklistedtoken`
--

DROP TABLE IF EXISTS `token_blacklist_blacklistedtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_blacklistedtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `blacklisted_at` datetime(6) NOT NULL,
  `token_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_id` (`token_id`),
  CONSTRAINT `token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk` FOREIGN KEY (`token_id`) REFERENCES `token_blacklist_outstandingtoken` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_blacklistedtoken`
--

LOCK TABLES `token_blacklist_blacklistedtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` DISABLE KEYS */;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_outstandingtoken`
--

DROP TABLE IF EXISTS `token_blacklist_outstandingtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_outstandingtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) NOT NULL,
  `user_id` int DEFAULT NULL,
  `jti` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq` (`jti`),
  KEY `token_blacklist_outs_user_id_83bc629a_fk_auth_user` (`user_id`),
  CONSTRAINT `token_blacklist_outs_user_id_83bc629a_fk_auth_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_outstandingtoken`
--

LOCK TABLES `token_blacklist_outstandingtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` DISABLE KEYS */;
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nickname` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_registro` datetime(6) NOT NULL,
  `total_quizzes_completados` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nickname` (`nickname`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Ana García','2025-11-24 17:31:38.000000',1),(2,'Carlos Ruiz','2025-11-24 17:31:38.000000',1),(3,'María López','2025-11-24 17:31:38.000000',1),(4,'eve','2025-11-26 01:18:04.000000',1);
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

-- Dump completed on 2025-11-26  1:36:11
