from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdministradorViewSet,
    login_administrador,
    logout_administrador,
    refresh_token,
    QuizViewSet
)

router = DefaultRouter()
router.register(r'quizzes', QuizViewSet, basename='quiz')
router.register(r'administradores', AdministradorViewSet, basename='administrador')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_administrador, name='login'),
    path('refresh/', refresh_token, name='refresh'),
    path('logout/', logout_administrador, name='logout'),
]
