from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import transaction
import logging

from .models import Quiz, Pregunta, Respuesta
from .serializers import (
    QuizSerializer, 
    QuizListSerializer, 
    QuizCreateSerializer,
    PreguntaSerializer,
    PreguntaCreateSerializer,
    RespuestaSerializer
)

logger = logging.getLogger(__name__)


class QuizViewSet(viewsets.ModelViewSet):
    """
    ViewSet para CRUD de Quizzes
    - Administradores: pueden hacer CRUD completo
    - Usuarios: solo pueden ver quizzes activos
    """
    queryset = Quiz.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return QuizListSerializer
        elif self.action == 'create':
            return QuizCreateSerializer
        return QuizSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'obtener_por_qr']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Filtrar quizzes según permisos"""
        if self.request.user.is_authenticated:
            # Administradores ven todos
            return Quiz.objects.all()
        else:
            # Usuarios solo ven activos
            return Quiz.objects.filter(activo=True)
    
    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def completo(self, request, pk=None):
        """
        Obtener quiz completo con preguntas y respuestas
        GET /api/quizzes/{id}/completo/
        """
        try:
            quiz = self.get_object()
            serializer = QuizSerializer(quiz)
            return Response(serializer.data)
        except Quiz.DoesNotExist:
            return Response(
                {"error": "Quiz no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def activos(self, request):
        """
        Listar solo quizzes activos
        GET /api/quizzes/activos/
        """
        quizzes = Quiz.objects.filter(activo=True)
        serializer = QuizListSerializer(quizzes, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_activo(self, request, pk=None):
        """
        Activar/Desactivar un quiz
        POST /api/quizzes/{id}/toggle_activo/
        """
        quiz = self.get_object()
        quiz.activo = not quiz.activo
        quiz.save()
        
        logger.info(f"Quiz {quiz.id} {'activado' if quiz.activo else 'desactivado'}")
        
        return Response({
            "message": f"Quiz {'activado' if quiz.activo else 'desactivado'} exitosamente",
            "activo": quiz.activo
        })


class PreguntaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para CRUD de Preguntas
    """
    queryset = Pregunta.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PreguntaCreateSerializer
        return PreguntaSerializer
    
    def get_queryset(self):
        """Filtrar preguntas por quiz si se proporciona"""
        queryset = Pregunta.objects.all()
        quiz_id = self.request.query_params.get('quiz_id', None)
        
        if quiz_id:
            queryset = queryset.filter(quiz_id=quiz_id)
        
        return queryset.order_by('orden')
    
    @action(detail=False, methods=['post'])
    @transaction.atomic
    def crear_con_respuestas(self, request):
        """
        Crear pregunta con sus respuestas en una sola petición
        POST /api/preguntas/crear_con_respuestas/
        Body: {
            "quiz": 1,
            "texto_pregunta": "...",
            "tipo": "multiple",
            "puntaje": 10,
            "orden": 1,
            "respuestas": [
                {"texto_respuesta": "...", "es_correcta": true, "orden": 1},
                {"texto_respuesta": "...", "es_correcta": false, "orden": 2}
            ]
        }
        """
        try:
            respuestas_data = request.data.pop('respuestas', [])
            
            # Crear pregunta
            pregunta_serializer = PreguntaCreateSerializer(data=request.data)
            if not pregunta_serializer.is_valid():
                return Response(
                    pregunta_serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            pregunta = pregunta_serializer.save()
            
            # Crear respuestas
            for respuesta_data in respuestas_data:
                respuesta_data['pregunta'] = pregunta.id
                respuesta_serializer = RespuestaSerializer(data=respuesta_data)
                if respuesta_serializer.is_valid():
                    respuesta_serializer.save()
            
            # Retornar pregunta completa con respuestas
            pregunta_completa = PreguntaSerializer(pregunta)
            logger.info(f"Pregunta {pregunta.id} creada con respuestas")
            
            return Response(
                pregunta_completa.data,
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            logger.error(f"Error al crear pregunta con respuestas: {str(e)}")
            return Response(
                {"error": "Error al crear pregunta"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RespuestaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para CRUD de Respuestas
    """
    queryset = Respuesta.objects.all()
    serializer_class = RespuestaSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filtrar respuestas por pregunta si se proporciona"""
        queryset = Respuesta.objects.all()
        pregunta_id = self.request.query_params.get('pregunta_id', None)
        
        if pregunta_id:
            queryset = queryset.filter(pregunta_id=pregunta_id)
        
        return queryset.order_by('orden')
