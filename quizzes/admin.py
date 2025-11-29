from django.contrib import admin
from .models import Quiz, Pregunta, Respuesta

@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'idioma', 'activo', 'fecha_creacion']
    search_fields = ['titulo']
    list_filter = ['activo', 'idioma']

@admin.register(Pregunta)
class PreguntaAdmin(admin.ModelAdmin):
    list_display = ['texto_pregunta', 'quiz', 'tipo', 'puntaje', 'orden']
    search_fields = ['texto_pregunta']
    list_filter = ['quiz', 'tipo']

@admin.register(Respuesta)
class RespuestaAdmin(admin.ModelAdmin):
    list_display = ['texto_respuesta', 'pregunta', 'es_correcta']
    search_fields = ['texto_respuesta']
    list_filter = ['es_correcta']