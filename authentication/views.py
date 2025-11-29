from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from datetime import timedelta
import logging

from .models import Administrador, Quiz
from .serializers import (
    AdministradorSerializer,
    LoginSerializer,
    AdministradorInfoSerializer,
    QuizSerializer
)

logger = logging.getLogger(__name__)

# --- VIEWS PARA ADMINISTRADOR ---
class AdministradorViewSet(viewsets.ModelViewSet):
    queryset = Administrador.objects.all()
    serializer_class = AdministradorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Administrador.objects.filter(is_active=True)

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = AdministradorInfoSerializer(request.user)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_administrador(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response({"error": "Email y contraseña son requeridos."}, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    password = serializer.validated_data['password']
    ip_address = request.META.get('REMOTE_ADDR')

    try:
        admin = Administrador.objects.get(email=email, is_active=True)

        if admin.account_locked_until and admin.account_locked_until > timezone.now():
            tiempo_restante = int((admin.account_locked_until - timezone.now()).seconds / 60)
            logger.warning(f"Intento de login en cuenta bloqueada: {email} desde {ip_address}")
            return Response({"error": f"Cuenta bloqueada. Intente en {tiempo_restante} minutos."}, status=status.HTTP_403_FORBIDDEN)

        if not admin.check_password(password):
            admin.failed_login_attempts += 1
            admin.last_failed_login = timezone.now()
            if admin.failed_login_attempts >= 5:
                admin.account_locked_until = timezone.now() + timedelta(hours=1)
            admin.save()
            logger.warning(f"Login fallido para {email} desde {ip_address}. Intentos: {admin.failed_login_attempts}")
            if admin.failed_login_attempts >= 5:
                return Response({"error": "Cuenta bloqueada por múltiples intentos fallidos. Intente en 1 hora."}, status=status.HTTP_403_FORBIDDEN)
            return Response({"error": "Credenciales inválidas."}, status=status.HTTP_401_UNAUTHORIZED)

        # Login exitoso - Generar tokens JWT
        refresh = RefreshToken.for_user(admin)
        admin.failed_login_attempts = 0
        admin.last_failed_login = None
        admin.account_locked_until = None
        admin.last_login = timezone.now()
        admin.last_login_ip = ip_address
        admin.save()
        logger.info(f"Login exitoso {email} desde {ip_address}")

        response = Response({
            "message": "Login exitoso",
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "administrador": {
                "id": admin.id,
                "email": admin.email,
                "nombre": admin.nombre,
            }
        }, status=status.HTTP_200_OK)
        response.set_cookie(key='refresh_token', value=str(refresh), httponly=True, secure=False, samesite="Lax", max_age=60*60*24*7)
        return response

    except Administrador.DoesNotExist:
        logger.warning(f"Intento de login con email inexistente: {email} desde {ip_address}")
        return Response({"error": "Credenciales inválidas."}, status=status.HTTP_401_UNAUTHORIZED)

    except Exception as e:
        logger.error(f"Error en login: {str(e)}")
        return Response({"error": "Error en el servidor."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    refresh_token_str = request.COOKIES.get('refresh_token')
    if not refresh_token_str:
        return Response({"error": "Refresh token no encontrado."}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        refresh = RefreshToken(refresh_token_str)
        new_access_token = str(refresh.access_token)
        logger.info(f"Access token renovado para usuario {refresh.get('user_id')}")
        return Response({"access_token": new_access_token}, status=status.HTTP_200_OK)
    except Exception as e:
        logger.warning(f"Intento de renovación con refresh token inválido: {str(e)}")
        return Response({"error": "Refresh token inválido o expirado."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_administrador(request):
    refresh_token = request.COOKIES.get('refresh_token')
    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            logger.info(f"Logout exitoso para usuario {token.get('user_id')}")
        except Exception as e:
            logger.error(f"Error al hacer logout: {str(e)}")
    response = Response({"message": "Sesión cerrada exitosamente"}, status=status.HTTP_200_OK)
    response.delete_cookie('refresh_token')
    return response

# --- VIEWS PARA QUIZZES ---
class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    permission_classes = [AllowAny]