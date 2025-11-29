from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Quiz(models.Model):
    IDIOMA_CHOICES = [('es', 'Español'), ('en', 'Inglés')]
    
    id = models.AutoField(primary_key=True)
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    tiempo_limite = models.IntegerField(validators=[MinValueValidator(30), MaxValueValidator(1800)])
    idioma = models.CharField(max_length=2, choices=IDIOMA_CHOICES, default='es')
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_modificacion = models.DateTimeField(auto_now=True)
    creado_por = models.ForeignKey('authentication.Administrador', on_delete=models.SET_NULL, null=True, related_name='quizzes_creados')
    
    class Meta:
        db_table = 'quizzes'
    
    def __str__(self):
        return self.titulo

class Pregunta(models.Model):
    TIPO_CHOICES = [('multiple', 'Opción Múltiple'), ('verdadero_falso', 'Verdadero/Falso')]
    
    id = models.AutoField(primary_key=True)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='preguntas')
    texto_pregunta = models.TextField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='multiple')
    puntaje = models.IntegerField(default=10, validators=[MinValueValidator(1), MaxValueValidator(100)])
    orden = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'preguntas'
    
    def __str__(self):
        return f"Pregunta {self.orden}"

class Respuesta(models.Model):
    id = models.AutoField(primary_key=True)
    pregunta = models.ForeignKey(Pregunta, on_delete=models.CASCADE, related_name='respuestas')
    texto_respuesta = models.CharField(max_length=500)
    es_correcta = models.BooleanField(default=False)
    orden = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'respuestas'
    
    def __str__(self):
        return self.texto_respuesta[:50]