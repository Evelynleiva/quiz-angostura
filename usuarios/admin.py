from django.contrib import admin
from .models import Usuario, SesionQuiz

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ['nickname', 'total_quizzes_completados', 'fecha_registro']
    search_fields = ['nickname']

@admin.register(SesionQuiz)
class SesionQuizAdmin(admin.ModelAdmin):
    list_display = ['usuario', 'quiz', 'puntaje_obtenido', 'completado', 'fecha_hora_inicio']
    search_fields = ['usuario__nickname']
    list_filter = ['completado', 'fecha_hora_inicio']