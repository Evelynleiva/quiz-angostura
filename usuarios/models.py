from django.db import models
from django.core.validators import RegexValidator

class Usuario(models.Model):
    id = models.AutoField(primary_key=True)
    nickname = models.CharField(
        max_length=20, 
        unique=True,
        validators=[RegexValidator(regex='^[a-zA-Z0-9_]+$', message='Solo letras, números y guiones bajos')]
    )
    fecha_registro = models.DateTimeField(auto_now_add=True)
    total_quizzes_completados = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'usuarios'
    
    def __str__(self):
        return self.nickname

class SesionQuiz(models.Model):
    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='sesiones')
    quiz = models.ForeignKey('quizzes.Quiz', on_delete=models.CASCADE, related_name='sesiones')
    codigo_qr = models.ForeignKey('qr_codes.CodigoQR', on_delete=models.SET_NULL, null=True, blank=True, related_name='sesiones')
    puntaje_obtenido = models.IntegerField(default=0)
    puntaje_maximo = models.IntegerField()
    tiempo_completado = models.IntegerField()
    fecha_hora_inicio = models.DateTimeField(auto_now_add=True)
    fecha_hora_fin = models.DateTimeField(null=True, blank=True)
    completado = models.BooleanField(default=False)
    
    class Meta:
        db_table = 'sesiones_quiz'
    
    def __str__(self):
        return f"{self.usuario.nickname} - {self.quiz.titulo}"