from rest_framework import serializers
from .models import Administrador
from django.contrib.auth.hashers import make_password
from .models import Quiz

class AdministradorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = Administrador
        fields = [
            'id', 'email', 'nombre', 'fecha_creacion', 
            'is_active', 'last_login', 'password'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'last_login']
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        administrador = Administrador(**validated_data)
        if password:
            administrador.password_hash = make_password(password)
        administrador.save()
        return administrador
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.password_hash = make_password(password)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class AdministradorInfoSerializer(serializers.ModelSerializer):
    """Serializer para información básica del administrador (sin datos sensibles)"""
    class Meta:
        model = Administrador
        fields = ['id', 'email', 'nombre', 'is_active']

class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = '__all__'