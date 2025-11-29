from django.contrib import admin
from .models import Ranking

@admin.register(Ranking)
class RankingAdmin(admin.ModelAdmin):
    list_display = ['posicion', 'sesion', 'fecha_actualizacion']
    ordering = ['posicion']