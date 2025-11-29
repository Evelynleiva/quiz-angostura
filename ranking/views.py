from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Q
import logging

from .models import Ranking
from .serializers import RankingSerializer
from usuarios.models import SesionQuiz

logger = logging.getLogger(__name__)


class RankingViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para consultar el ranking (solo lectura)
    """
    queryset = Ranking.objects.all()
    serializer_class = RankingSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Filtrar ranking por quiz si se proporciona"""
        queryset = Ranking.objects.all().order_by('posicion')
        quiz_id = self.request.query_params.get('quiz_id', None)
        
        if quiz_id:
            queryset = queryset.filter(sesion__quiz_id=quiz_id)
        
        return queryset[:100]  # Top 100


@api_view(['GET'])
@permission_classes([AllowAny])
def ranking_por_quiz(request, quiz_id):
    """
    Obtener ranking de un quiz específico
    GET /api/ranking/quiz/{quiz_id}/
    Query params:
        - limit: número de resultados (default 10)
    """
    try:
        limit = int(request.query_params.get('limit', 10))
        limit = min(limit, 100)  # Máximo 100
        
        # Obtener mejores sesiones del quiz
        mejores_sesiones = SesionQuiz.objects.filter(
            quiz_id=quiz_id,
            completado=True
        ).select_related('usuario', 'quiz').order_by(
            '-puntaje_obtenido',
            'tiempo_completado'
        )[:limit]
        
        ranking_data = []
        for idx, sesion in enumerate(mejores_sesiones, start=1):
            ranking_data.append({
                "posicion": idx,
                "nickname": sesion.usuario.nickname,
                "puntaje": sesion.puntaje_obtenido,
                "puntaje_maximo": sesion.puntaje_maximo,
                "porcentaje": sesion.porcentaje_acierto(),
                "tiempo": sesion.tiempo_completado,
                "fecha": sesion.fecha_hora_fin
            })
        
        return Response({
            "quiz_id": quiz_id,
            "total_participantes": SesionQuiz.objects.filter(
                quiz_id=quiz_id,
                completado=True
            ).count(),
            "ranking": ranking_data
        })
        
    except Exception as e:
        logger.error(f"Error al obtener ranking: {str(e)}")
        return Response(
            {"error": "Error al obtener ranking"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def ranking_global(request):
    """
    Obtener ranking global (todos los quizzes)
    GET /api/ranking/global/
    """
    try:
        limit = int(request.query_params.get('limit', 20))
        limit = min(limit, 100)
        
        mejores_sesiones = SesionQuiz.objects.filter(
            completado=True
        ).select_related('usuario', 'quiz').order_by(
            '-puntaje_obtenido',
            'tiempo_completado'
        )[:limit]
        
        ranking_data = []
        for idx, sesion in enumerate(mejores_sesiones, start=1):
            ranking_data.append({
                "posicion": idx,
                "nickname": sesion.usuario.nickname,
                "quiz_titulo": sesion.quiz.titulo,
                "puntaje": sesion.puntaje_obtenido,
                "puntaje_maximo": sesion.puntaje_maximo,
                "porcentaje": sesion.porcentaje_acierto(),
                "tiempo": sesion.tiempo_completado,
                "fecha": sesion.fecha_hora_fin
            })
        
        return Response({
            "ranking": ranking_data
        })
        
    except Exception as e:
        logger.error(f"Error al obtener ranking global: {str(e)}")
        return Response(
            {"error": "Error al obtener ranking global"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def mi_posicion(request, sesion_id):
    """
    Obtener posición de una sesión específica en el ranking
    GET /api/ranking/mi-posicion/{sesion_id}/
    """
    try:
        sesion = SesionQuiz.objects.get(id=sesion_id, completado=True)
        
        # Contar cuántas sesiones tienen mejor puntaje o mismo puntaje pero mejor tiempo
        mejores = SesionQuiz.objects.filter(
            quiz=sesion.quiz,
            completado=True
        ).filter(
            Q(puntaje_obtenido__gt=sesion.puntaje_obtenido) |
            Q(
                puntaje_obtenido=sesion.puntaje_obtenido,
                tiempo_completado__lt=sesion.tiempo_completado
            )
        ).count()
        
        posicion = mejores + 1
        
        total_participantes = SesionQuiz.objects.filter(
            quiz=sesion.quiz,
            completado=True
        ).count()
        
        return Response({
            "sesion_id": sesion_id,
            "nickname": sesion.usuario.nickname,
            "posicion": posicion,
            "total_participantes": total_participantes,
            "puntaje": sesion.puntaje_obtenido,
            "puntaje_maximo": sesion.puntaje_maximo,
            "tiempo": sesion.tiempo_completado
        })
        
    except SesionQuiz.DoesNotExist:
        return Response(
            {"error": "Sesión no encontrada o no completada"},
            status=status.HTTP_404_NOT_FOUND
        )