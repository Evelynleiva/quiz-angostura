from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuizViewSet, PreguntaViewSet, RespuestaViewSet

router = DefaultRouter()
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'preguntas', PreguntaViewSet, basename='pregunta')
router.register(r'respuestas', RespuestaViewSet, basename='respuesta')

urlpatterns = [
    path('', include(router.urls)),
]