from rest_framework import serializers
from .models import CodigoQR

class CodigoQRSerializer(serializers.ModelSerializer):
    quiz_titulo = serializers.CharField(source='quiz.titulo', read_only=True)
    creado_por_nombre = serializers.CharField(source='creado_por.nombre', read_only=True)
    url_completa = serializers.SerializerMethodField()
    
    class Meta:
        model = CodigoQR
        fields = [
            'id', 'codigo_unico', 'quiz', 'quiz_titulo',
            'activo', 'fecha_creacion', 'fecha_desactivacion',
            'creado_por', 'creado_por_nombre', 'ubicacion_fisica',
            'numero_escaneos', 'url_completa'
        ]
        read_only_fields = ['id', 'codigo_unico', 'fecha_creacion', 'numero_escaneos']
    
    def get_url_completa(self, obj):
        # En producción cambiar por dominio real
        return f"http://localhost:5173/quiz/{obj.codigo_unico}"


class CodigoQRCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodigoQR
        fields = ['quiz', 'ubicacion_fisica', 'creado_por']