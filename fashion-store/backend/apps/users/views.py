from rest_framework import generics, status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer, UserSerializer, UserProfileSerializer
from .permissions import IsAdministrador

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer personalizado para incluir información del usuario en el token"""
    def validate(self, attrs):
        data = super().validate(attrs)
        # Agregar información del usuario a la respuesta
        data['user'] = UserSerializer(self.user).data
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """Vista personalizada para obtener tokens JWT con información del usuario"""
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """Vista para registrar nuevos usuarios"""
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Vista para ver y actualizar el perfil del usuario autenticado"""
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        """Actualizar perfil con mejor manejo de errores"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Obtener la instancia actualizada
        updated_instance = self.get_object()
        updated_serializer = self.get_serializer(updated_instance)
        
        return Response({
            'message': 'Perfil actualizado exitosamente',
            'profile': updated_serializer.data
        }, status=status.HTTP_200_OK)


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión de usuarios (solo administradores)"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdministrador]

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Obtener estadísticas de usuarios"""
        total_users = User.objects.count()
        administradores = User.objects.filter(role='administrador').count()
        clientes = User.objects.filter(role='cliente').count()
        
        return Response({
            'total_users': total_users,
            'administradores': administradores,
            'clientes': clientes,
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Cambiar contraseña del usuario autenticado"""
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    
    # Validar que se enviaron ambas contraseñas
    if not old_password or not new_password:
        return Response(
            {'message': 'Se requiere contraseña actual y nueva'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verificar que la contraseña actual es correcta
    if not user.check_password(old_password):
        return Response(
            {'message': 'Contraseña actual incorrecta'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Actualizar contraseña
    user.set_password(new_password)
    user.save()
    
    return Response({
        'message': 'Contraseña actualizada exitosamente'
    }, status=status.HTTP_200_OK)