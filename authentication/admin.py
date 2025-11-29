from django.contrib import admin
from .models import Administrador

@admin.register(Administrador)
class AdministradorAdmin(admin.ModelAdmin):
    list_display = ['email', 'nombre', 'is_active', 'fecha_creacion']
    search_fields = ['email', 'nombre']
    list_filter = ['is_active', 'fecha_creacion']