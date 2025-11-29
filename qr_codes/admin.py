from django.contrib import admin
from .models import CodigoQR

@admin.register(CodigoQR)
class CodigoQRAdmin(admin.ModelAdmin):
    list_display = ['codigo_unico', 'quiz', 'activo', 'numero_escaneos', 'fecha_creacion']
    search_fields = ['codigo_unico', 'ubicacion_fisica']
    list_filter = ['activo', 'fecha_creacion']