from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'role', 'phone', 'address', 'city', 'profile_image', 
                  'created_at']
        read_only_fields = ['id', 'created_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 
                  'first_name', 'last_name', 'role']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden"})
        
        if attrs.get('role') not in ['cliente', 'administrador']:
            attrs['role'] = 'cliente'
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    orders_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name',
                  'role', 'phone', 'address', 'city', 'profile_image',
                  'orders_count', 'created_at']
        read_only_fields = ['id', 'username', 'role', 'created_at']
    
    def get_orders_count(self, obj):
        return obj.orders.count()
    
    def validate_first_name(self, value):
        """Validar nombre"""
        if not value or value.strip() == '':
            raise serializers.ValidationError('El nombre es requerido')
        if len(value.strip()) < 2:
            raise serializers.ValidationError('El nombre debe tener al menos 2 caracteres')
        return value.strip()
    
    def validate_last_name(self, value):
        """Validar apellido"""
        if not value or value.strip() == '':
            raise serializers.ValidationError('El apellido es requerido')
        if len(value.strip()) < 2:
            raise serializers.ValidationError('El apellido debe tener al menos 2 caracteres')
        return value.strip()
    
    def validate_email(self, value):
        """Validar email único"""
        if not value or value.strip() == '':
            raise serializers.ValidationError('El email es requerido')
        
        # Verificar formato de email
        if '@' not in value:
            raise serializers.ValidationError('El formato del email no es válido')
        
        # Verificar si el email ya existe (excluyendo el usuario actual)
        user = self.instance
        if User.objects.filter(email=value).exclude(id=user.id).exists():
            raise serializers.ValidationError('Este email ya está registrado')
        
        return value.strip()
    
    def validate_phone(self, value):
        """Validar teléfono"""
        if value and value.strip() != '':
            import re
            phone_pattern = re.compile(r'^(\+57)?\s?[0-9\s\-\(\)]{7,15}$')
            if not phone_pattern.match(value):
                raise serializers.ValidationError('El formato del teléfono no es válido')
        return value.strip() if value else ''