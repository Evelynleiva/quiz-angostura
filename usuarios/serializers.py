from rest_framework import serializers
from .models import Usuario, SesionQuiz

class UsuarioSerializer(serializers.ModelSerializer):
    mejor_puntaje = serializers.SerializerMethodField()
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'nickname', 'fecha_registro',
            'total_quizzes_completados', 'mejor_puntaje'
        ]
        read_only_fields = ['id', 'fecha_registro', 'total_quizzes_completados']
    
    def get_mejor_puntaje(self, obj):
        sesion = obj.sesiones.filter(completado=True).order_by('-puntaje_obtenido').first()
        return sesion.puntaje_obtenido if sesion else 0


class UsuarioCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['nickname']


class SesionQuizSerializer(serializers.ModelSerializer):
    usuario_nickname = serializers.CharField(source='usuario.nickname', read_only=True)
    quiz_titulo = serializers.CharField(source='quiz.titulo', read_only=True)
    porcentaje_acierto = serializers.SerializerMethodField()
    
    class Meta:
        model = SesionQuiz
        fields = [
            'id', 'usuario', 'usuario_nickname', 'quiz', 'quiz_titulo',
            'codigo_qr', 'puntaje_obtenido', 'puntaje_maximo',
            'tiempo_completado', 'fecha_hora_inicio', 'fecha_hora_fin',
            'completado', 'porcentaje_acierto'
        ]
        read_only_fields = ['id', 'fecha_hora_inicio']
    
    def get_porcentaje_acierto(self, obj):
        if obj.puntaje_maximo == 0:
            return 0
        return round((obj.puntaje_obtenido / obj.puntaje_maximo) * 100, 2)


class IniciarQuizSerializer(serializers.Serializer):
    """Serializer para iniciar una sesión de quiz"""
    nickname = serializers.CharField(max_length=20)
    codigo_qr = serializers.UUIDField()


class ResponderQuizSerializer(serializers.Serializer):
    """Serializer para enviar respuestas del quiz"""
    sesion_id = serializers.IntegerField()
    respuestas = serializers.ListField(
        child=serializers.DictField(
            child=serializers.IntegerField()
        )
    )
    tiempo_completado = serializers.IntegerField()