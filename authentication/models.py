from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone

class Administrador(models.Model):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(unique=True, max_length=255)
    password_hash = models.CharField(max_length=255)
    nombre = models.CharField(max_length=100)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    ultimo_cambio_password = models.DateTimeField(default=timezone.now)
    failed_login_attempts = models.IntegerField(default=0)
    last_failed_login = models.DateTimeField(null=True, blank=True)
    account_locked_until = models.DateTimeField(null=True, blank=True)
    last_login = models.DateTimeField(null=True, blank=True)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='administradores_creados')
    
    class Meta:
        db_table = 'administradores'
    
    def __str__(self):
        return self.email
    
    
class Quiz(models.Model):
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    tiempolimite = models.IntegerField(default=60)  # segundos
    idioma = models.CharField(max_length=50, default='es')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo
