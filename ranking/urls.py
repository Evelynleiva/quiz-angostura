from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RankingViewSet,
    ranking_por_quiz,
    ranking_global,
    mi_posicion
)

router = DefaultRouter()
router.register(r'ranking', RankingViewSet, basename='ranking')

urlpatterns = [
    path('', include(router.urls)),
    path('quiz/<int:quiz_id>/', ranking_por_quiz, name='ranking-quiz'),
    path('global/', ranking_global, name='ranking-global'),
    path('mi-posicion/<int:sesion_id>/', mi_posicion, name='mi-posicion'),
]