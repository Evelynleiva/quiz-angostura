from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    """Vista principal de la API"""
    return JsonResponse({
        "message": "API del Museo Angostura - Sistema de Quiz Interactivo",
        "version": "1.0",
        "mascota": "🦊 Quibar - Mascota del Museo Angostura",
        "endpoints": {
            "admin": "/admin/",
            "autenticacion": {
                "login": "/api/auth/login/",
                "logout": "/api/auth/logout/",
                "refresh": "/api/auth/refresh/"
            },
            "quizzes": {
                "listar": "/api/quizzes/",
                "activos": "/api/quizzes/activos/",
                "detalle": "/api/quizzes/{id}/",
                "completo": "/api/quizzes/{id}/completo/"
            },
            "codigos_qr": {
                "listar": "/api/codigos-qr/",
                "validar": "/api/codigos-qr/validar/",
                "imagen": "/api/codigos-qr/{id}/imagen/"
            },
            "usuarios": {
                "crear_obtener": "/api/usuarios/crear_o_obtener/",
                "iniciar_quiz": "/api/quiz/iniciar/",
                "responder_quiz": "/api/quiz/responder/",
                "resultado": "/api/quiz/resultado/{sesion_id}/"
            },
            "ranking": {
                "por_quiz": "/api/ranking/quiz/{quiz_id}/",
                "global": "/api/ranking/global/",
                "mi_posicion": "/api/ranking/mi-posicion/{sesion_id}/"
            }
        }
    })

urlpatterns = [
    # Página de inicio (API Root)
    path('', api_root, name='api-root'),
    
    # Admin de Django
    path('admin/', admin.site.urls),
    path('api/', include('authentication.urls')),
    
    # API de autenticación
    path('api/auth/', include('authentication.urls')),
    
    # API de quizzes
    path('api/', include('quizzes.urls')),
    
    # API de códigos QR
    path('api/', include('qr_codes.urls')),
    
    # API de usuarios
    path('api/', include('usuarios.urls')),
    
    # API de ranking
    path('api/ranking/', include('ranking.urls')),
]

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
