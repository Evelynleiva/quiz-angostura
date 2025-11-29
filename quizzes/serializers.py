from rest_framework import serializers
from .models import Quiz, Pregunta, Respuesta

class RespuestaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Respuesta
        fields = ['id', 'texto_respuesta', 'es_correcta', 'orden']
        read_only_fields = ['id']


class PreguntaSerializer(serializers.ModelSerializer):
    respuestas = RespuestaSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pregunta
        fields = ['id', 'texto_pregunta', 'tipo', 'puntaje', 'orden', 'respuestas']
        read_only_fields = ['id']


class PreguntaCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear preguntas sin respuestas anidadas"""
    class Meta:
        model = Pregunta
        fields = ['id', 'quiz', 'texto_pregunta', 'tipo', 'puntaje', 'orden']
        read_only_fields = ['id']


class QuizSerializer(serializers.ModelSerializer):
    preguntas = PreguntaSerializer(many=True, read_only=True)
    total_preguntas = serializers.SerializerMethodField()
    puntaje_maximo = serializers.SerializerMethodField()
    creado_por_nombre = serializers.CharField(source='creado_por.nombre', read_only=True)
    
    class Meta:
        model = Quiz
        fields = [
            'id', 'titulo', 'descripcion', 'tiempo_limite', 'idioma',
            'activo', 'fecha_creacion', 'fecha_modificacion',
            'creado_por', 'creado_por_nombre', 'preguntas',
            'total_preguntas', 'puntaje_maximo'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'fecha_modificacion']
    
    def get_total_preguntas(self, obj):
        return obj.preguntas.count()
    
    def get_puntaje_maximo(self, obj):
        return sum([p.puntaje for p in obj.preguntas.all()])


class QuizListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listar quizzes (sin preguntas)"""
    total_preguntas = serializers.SerializerMethodField()
    
    class Meta:
        model = Quiz
        fields = [
            'id', 'titulo', 'descripcion', 'tiempo_limite',
            'idioma', 'activo', 'total_preguntas'
        ]
    
    def get_total_preguntas(self, obj):
        return obj.preguntas.count()


class QuizCreateSerializer(serializers.ModelSerializer):
    """Serializer para crear quiz sin preguntas anidadas"""
    class Meta:
        model = Quiz
        fields = [
            'id', 'titulo', 'descripcion', 'tiempo_limite',
            'idioma', 'activo', 'creado_por'
        ]
        read_only_fields = ['id']