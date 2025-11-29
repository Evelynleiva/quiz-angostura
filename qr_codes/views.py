from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
import qrcode
from io import BytesIO
import logging

from .models import CodigoQR
from .serializers import CodigoQRSerializer, CodigoQRCreateSerializer
from quizzes.models import Quiz

logger = logging.getLogger(__name__)


class CodigoQRViewSet(viewsets.ModelViewSet):
    """
    ViewSet para CRUD de Códigos QR
    """
    queryset = CodigoQR.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return CodigoQRCreateSerializer
        return CodigoQRSerializer
    
    def get_permissions(self):
        if self.action in ['validar', 'incrementar_escaneo']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def imagen(self, request, pk=None):
        """
        Generar imagen QR en formato PNG
        GET /api/codigos-qr/{id}/imagen/
        """
        try:
            codigo_qr = self.get_object()
            
            # Generar QR
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            
            # URL que apunta al frontend
            url = f"http://localhost:5173/quiz/{codigo_qr.codigo_unico}"
            qr.add_data(url)
            qr.make(fit=True)
            
            # Crear imagen
            img = qr.make_image(fill_color="black", back_color="white")
            
            # Guardar en buffer
            buffer = BytesIO()
            img.save(buffer, format='PNG')
            buffer.seek(0)
            
            logger.info(f"Imagen QR generada para código {codigo_qr.codigo_unico}")
            
            return HttpResponse(buffer, content_type='image/png')
            
        except Exception as e:
            logger.error(f"Error al generar imagen QR: {str(e)}")
            return Response(
                {"error": "Error al generar código QR"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def validar(self, request):
        """
        Validar si un código QR es válido y está activo
        POST /api/codigos-qr/validar/
        Body: {"codigo_unico": "uuid-here"}
        """
        codigo_unico = request.data.get('codigo_unico')
        
        if not codigo_unico:
            return Response(
                {"error": "Código único es requerido"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            codigo_qr = CodigoQR.objects.get(codigo_unico=codigo_unico)
            
            if not codigo_qr.activo:
                return Response(
                    {"error": "Este código QR ha sido desactivado"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not codigo_qr.quiz.activo:
                return Response(
                    {"error": "El quiz asociado no está activo"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            serializer = CodigoQRSerializer(codigo_qr)
            return Response({
                "valido": True,
                "codigo_qr": serializer.data
            })
            
        except CodigoQR.DoesNotExist:
            return Response(
                {"error": "Código QR no encontrado"},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def incrementar_escaneo(self, request, pk=None):
        """
        Incrementar contador de escaneos
        POST /api/codigos-qr/{id}/incrementar_escaneo/
        """
        codigo_qr = self.get_object()
        codigo_qr.incrementar_escaneos()
        
        logger.info(f"Escaneo #{codigo_qr.numero_escaneos} del código {codigo_qr.codigo_unico}")
        
        return Response({
            "message": "Escaneo registrado",
            "numero_escaneos": codigo_qr.numero_escaneos
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def toggle_activo(self, request, pk=None):
        """
        Activar/Desactivar un código QR
        POST /api/codigos-qr/{id}/toggle_activo/
        """
        codigo_qr = self.get_object()
        codigo_qr.activo = not codigo_qr.activo
        
        if not codigo_qr.activo:
            from django.utils import timezone
            codigo_qr.fecha_desactivacion = timezone.now()
        else:
            codigo_qr.fecha_desactivacion = None
        
        codigo_qr.save()
        
        logger.info(f"Código QR {codigo_qr.id} {'activado' if codigo_qr.activo else 'desactivado'}")
        
        return Response({
            "message": f"Código QR {'activado' if codigo_qr.activo else 'desactivado'} exitosamente",
            "activo": codigo_qr.activo
        })