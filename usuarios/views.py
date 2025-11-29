from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import transaction
from django.utils import timezone
from django.shortcuts import get_object_or_404
import logging

from .models import Usuario, SesionQuiz
from .serializers import (
    UsuarioSerializer,
    UsuarioCreateSerializer,
    SesionQuizSerializer,
    IniciarQuizSerializer,
    ResponderQuizSerializer
)
from qr_codes.models import CodigoQR
from quizzes.models import Quiz, Pregunta, Respuesta

logger = logging.getLogger(__name__)


class UsuarioViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de usuarios visitantes
    """
    queryset = Usuario.objects.all()
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UsuarioCreateSerializer
        return UsuarioSerializer
    
    @action(detail=False, methods=['post'])
    def verificar_nickname(self, request):
        """
        Verificar si un nickname está disponible
        POST /api/usuarios/verificar_nickname/
        Body: {"nickname": "jugador123"}
        """
        nickname = request.data.get('nickname', '').strip()
        
        if not nickname:
            return Response(
                {"error": "Nickname es requerido"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if len(nickname) < 3 or len(nickname) > 20:
            return Response(
                {"error": "El nickname debe tener entre 3 y 20 caracteres"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        existe = Usuario.objects.filter(nickname__iexact=nickname).exists()
        
        return Response({
            "disponible": not existe,
            "nickname": nickname
        })
    
    @action(detail=False, methods=['post'])
    def crear_o_obtener(self, request):
        """
        Crear usuario si no existe, o retornar existente
        POST /api/usuarios/crear_o_obtener/
        Body: {"nickname": "jugador123"}
        """
        nickname = request.data.get('nickname', '').strip()
        
        if not nickname:
            return Response(
                {"error": "Nickname es requerido"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Intentar obtener o crear usuario
        usuario, created = Usuario.objects.get_or_create(
            nickname__iexact=nickname,
            defaults={'nickname': nickname}
        )
        
        serializer = UsuarioSerializer(usuario)
        
        logger.info(f"Usuario {'creado' if created else 'obtenido'}: {nickname}")
        
        return Response({
            "usuario": serializer.data,
            "created": created
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


class SesionQuizViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestión de sesiones de quiz
    """
    queryset = SesionQuiz.objects.all()
    serializer_class = SesionQuizSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Filtrar sesiones por usuario si se proporciona"""
        queryset = SesionQuiz.objects.all()
        usuario_id = self.request.query_params.get('usuario_id', None)
        
        if usuario_id:
            queryset = queryset.filter(usuario_id=usuario_id)
        
        return queryset.order_by('-fecha_hora_inicio')


@api_view(['POST'])
@permission_classes([AllowAny])
@transaction.atomic
def iniciar_quiz(request):
    """
    Iniciar una nueva sesión de quiz
    POST /api/quiz/iniciar/
    Body: {
        "nickname": "jugador123",
        "codigo_qr": "uuid-del-qr"
    }
    """
    serializer = IniciarQuizSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    nickname = serializer.validated_data['nickname']
    codigo_qr_uuid = serializer.validated_data['codigo_qr']
    
    try:
        # Verificar que el código QR existe y está activo
        codigo_qr = CodigoQR.objects.get(codigo_unico=codigo_qr_uuid, activo=True)
        
        if not codigo_qr.quiz.activo:
            return Response(
                {"error": "El quiz no está activo"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Obtener o crear usuario
        usuario, created = Usuario.objects.get_or_create(
            nickname__iexact=nickname,
            defaults={'nickname': nickname}
        )
        
        # Verificar que el quiz tenga preguntas
        if codigo_qr.quiz.preguntas.count() == 0:
            return Response(
                {"error": "El quiz no tiene preguntas configuradas"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calcular puntaje máximo
        puntaje_maximo = sum([p.puntaje for p in codigo_qr.quiz.preguntas.all()])
        
        # Crear sesión
        sesion = SesionQuiz.objects.create(
            usuario=usuario,
            quiz=codigo_qr.quiz,
            codigo_qr=codigo_qr,
            puntaje_maximo=puntaje_maximo,
            tiempo_completado=0,
            completado=False
        )
        
        # Incrementar contador de escaneos
        codigo_qr.incrementar_escaneos()
        
        logger.info(f"Sesión {sesion.id} iniciada: usuario={nickname}, quiz={codigo_qr.quiz.titulo}")
        
        # Retornar sesión y quiz con preguntas
        from quizzes.serializers import QuizSerializer
        
        return Response({
            "sesion_id": sesion.id,
            "usuario": {
                "id": usuario.id,
                "nickname": usuario.nickname
            },
            "quiz": QuizSerializer(codigo_qr.quiz).data,
            "puntaje_maximo": puntaje_maximo,
            "tiempo_limite": codigo_qr.quiz.tiempo_limite
        }, status=status.HTTP_201_CREATED)
        
    except CodigoQR.DoesNotExist:
        return Response(
            {"error": "Código QR no válido o inactivo"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error al iniciar quiz: {str(e)}")
        return Response(
            {"error": "Error al iniciar quiz"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
@transaction.atomic
def responder_quiz(request):
    """
    Enviar respuestas del quiz y calcular puntaje
    POST /api/quiz/responder/
    Body: {
        "sesion_id": 1,
        "respuestas": [
            {"pregunta_id": 1, "respuesta_id": 3},
            {"pregunta_id": 2, "respuesta_id": 7}
        ],
        "tiempo_completado": 120
    }
    """
    serializer = ResponderQuizSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
    sesion_id = serializer.validated_data['sesion_id']
    respuestas_usuario = serializer.validated_data['respuestas']
    tiempo_completado = serializer.validated_data['tiempo_completado']
    
    try:
        sesion = SesionQuiz.objects.get(id=sesion_id)
        
        if sesion.completado:
            return Response(
                {"error": "Esta sesión ya fue completada"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calcular puntaje
        puntaje_obtenido = 0
        respuestas_correctas = 0
        total_preguntas = sesion.quiz.preguntas.count()
        
        detalles_respuestas = []
        
        for respuesta_data in respuestas_usuario:
            pregunta_id = respuesta_data.get('pregunta_id')
            respuesta_id = respuesta_data.get('respuesta_id')
            
            try:
                pregunta = Pregunta.objects.get(id=pregunta_id, quiz=sesion.quiz)
                respuesta = Respuesta.objects.get(id=respuesta_id, pregunta=pregunta)
                
                es_correcta = respuesta.es_correcta
                
                if es_correcta:
                    puntaje_obtenido += pregunta.puntaje
                    respuestas_correctas += 1
                
                detalles_respuestas.append({
                    "pregunta_id": pregunta_id,
                    "pregunta_texto": pregunta.texto_pregunta,
                    "respuesta_id": respuesta_id,
                    "respuesta_texto": respuesta.texto_respuesta,
                    "es_correcta": es_correcta,
                    "puntaje_pregunta": pregunta.puntaje,
                    "puntaje_obtenido": pregunta.puntaje if es_correcta else 0
                })
                
            except (Pregunta.DoesNotExist, Respuesta.DoesNotExist):
                logger.warning(f"Pregunta o respuesta inválida en sesión {sesion_id}")
                continue
        
        # Actualizar sesión
        sesion.puntaje_obtenido = puntaje_obtenido
        sesion.tiempo_completado = tiempo_completado
        sesion.completado = True
        sesion.fecha_hora_fin = timezone.now()
        sesion.save()
        
        # Actualizar contador de quizzes completados del usuario
        sesion.usuario.total_quizzes_completados += 1
        sesion.usuario.save()
        
        # Calcular posición en ranking (provisional)
        mejores_sesiones = SesionQuiz.objects.filter(
            quiz=sesion.quiz,
            completado=True
        ).order_by('-puntaje_obtenido', 'tiempo_completado')
        
        posicion = 1
        for idx, s in enumerate(mejores_sesiones, start=1):
            if s.id == sesion.id:
                posicion = idx
                break
        
        logger.info(
            f"Sesión {sesion.id} completada: "
            f"puntaje={puntaje_obtenido}/{sesion.puntaje_maximo}, "
            f"tiempo={tiempo_completado}s, "
            f"posición={posicion}"
        )
        
        return Response({
            "message": "Quiz completado exitosamente",
            "resultado": {
                "sesion_id": sesion.id,
                "puntaje_obtenido": puntaje_obtenido,
                "puntaje_maximo": sesion.puntaje_maximo,
                "porcentaje": round((puntaje_obtenido / sesion.puntaje_maximo) * 100, 2),
                "respuestas_correctas": respuestas_correctas,
                "total_preguntas": total_preguntas,
                "tiempo_completado": tiempo_completado,
                "posicion_ranking": posicion
            },
            "detalles_respuestas": detalles_respuestas
        }, status=status.HTTP_200_OK)
        
    except SesionQuiz.DoesNotExist:
        return Response(
            {"error": "Sesión no encontrada"},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error al responder quiz: {str(e)}")
        return Response(
            {"error": "Error al procesar respuestas"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def obtener_resultado(request, sesion_id):
    """
    Obtener resultado de una sesión completada
    GET /api/quiz/resultado/{sesion_id}/
    """
    try:
        sesion = SesionQuiz.objects.get(id=sesion_id)
        
        if not sesion.completado:
            return Response(
                {"error": "Esta sesión aún no ha sido completada"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = SesionQuizSerializer(sesion)
        
        # Calcular posición en ranking
        mejores_sesiones = SesionQuiz.objects.filter(
            quiz=sesion.quiz,
            completado=True
        ).order_by('-puntaje_obtenido', 'tiempo_completado')
        
        posicion = 1
        for idx, s in enumerate(mejores_sesiones, start=1):
            if s.id == sesion.id:
                posicion = idx
                break
        
        return Response({
            "sesion": serializer.data,
            "posicion_ranking": posicion
        })
        
    except SesionQuiz.DoesNotExist:
        return Response(
            {"error": "Sesión no encontrada"},
            status=status.HTTP_404_NOT_FOUND
        )