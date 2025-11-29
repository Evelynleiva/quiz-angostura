from rest_framework import serializers
from .models import Ranking

class RankingSerializer(serializers.ModelSerializer):
    nickname = serializers.CharField(source='sesion.usuario.nickname', read_only=True)
    quiz_titulo = serializers.CharField(source='sesion.quiz.titulo', read_only=True)
    puntaje = serializers.IntegerField(source='sesion.puntaje_obtenido', read_only=True)
    tiempo = serializers.IntegerField(source='sesion.tiempo_completado', read_only=True)
    
    class Meta:
        model = Ranking
        fields = [
            'id', 'posicion', 'nickname', 'quiz_titulo',
            'puntaje', 'tiempo', 'fecha_actualizacion'
        ]
        read_only_fields = ['id', 'fecha_actualizacion']