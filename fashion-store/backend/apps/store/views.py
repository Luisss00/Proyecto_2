from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import StoreConfiguration
from .serializers import StoreConfigurationSerializer

class StoreConfigurationView(APIView):
    """
    Vista para obtener y actualizar la configuración de la tienda
    """
    permission_classes = [AllowAny]  # Permitir acceso público para lectura
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get(self, request):
        """
        Obtener la configuración actual de la tienda
        """
        try:
            config = StoreConfiguration.get_singleton()
            serializer = StoreConfigurationSerializer(config)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': f'Error al obtener configuración: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def post(self, request):
        """
        Crear o actualizar la configuración de la tienda
        """
        try:
            config = StoreConfiguration.get_singleton()
            serializer = StoreConfigurationSerializer(config, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'error': 'Datos inválidos', 'details': serializer.errors},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {'error': f'Error al guardar configuración: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(['GET'])
@permission_classes([AllowAny])
def get_public_config(request):
    """
    Endpoint público para obtener solo la información básica para el frontend
    """
    try:
        config = StoreConfiguration.get_singleton()
        public_data = {
            'store_name': config.store_name,
            'store_email': config.store_email,
            'store_phone': config.store_phone,
            'store_address': config.store_address,
            'facebook_url': config.facebook_url,
            'instagram_url': config.instagram_url,
            'twitter_url': config.twitter_url,
            'logo': config.logo.url if config.logo else None,
            'banner_type': config.banner_type,
            'banner_color': config.banner_color,
            'banner_image': config.banner_image.url if config.banner_image else None,
            'footer_background_color': config.footer_background_color,
            'footer_text_color': config.footer_text_color,
            'footer_title_color': config.footer_title_color,
        }
        
        # Construir URL completa si el logo existe
        if public_data['logo']:
            if request:
                public_data['logo_url'] = request.build_absolute_uri(public_data['logo'])
            else:
                public_data['logo_url'] = public_data['logo']
        
        # Construir URL completa si la imagen del banner existe
        if public_data['banner_image']:
            if request:
                public_data['banner_image_url'] = request.build_absolute_uri(public_data['banner_image'])
            else:
                public_data['banner_image_url'] = public_data['banner_image']
        
        return Response(public_data)
    except Exception as e:
        return Response(
            {'error': f'Error al obtener configuración pública: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )