from django.db import models
import uuid

class CodigoQR(models.Model):
    id = models.AutoField(primary_key=True)
    codigo_unico = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    quiz = models.ForeignKey('quizzes.Quiz', on_delete=models.CASCADE, related_name='codigos_qr')
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_desactivacion = models.DateTimeField(null=True, blank=True)
    creado_por = models.ForeignKey('authentication.Administrador', on_delete=models.SET_NULL, null=True, related_name='codigos_qr_creados')
    ubicacion_fisica = models.CharField(max_length=200, blank=True)
    numero_escaneos = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'codigos_qr'
    
    def __str__(self):
        return f"QR-{self.codigo_unico.hex[:8]}"