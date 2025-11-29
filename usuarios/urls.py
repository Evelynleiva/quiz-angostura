from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet, 
    SesionQuizViewSet,
    iniciar_quiz,
    responder_quiz,
    obtener_resultado
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'sesiones', SesionQuizViewSet, basename='sesion')

urlpatterns = [
    path('', include(router.urls)),
    path('quiz/iniciar/', iniciar_quiz, name='iniciar-quiz'),
    path('quiz/responder/', responder_quiz, name='responder-quiz'),
    path('quiz/resultado/<int:sesion_id>/', obtener_resultado, name='obtener-resultado'),
]