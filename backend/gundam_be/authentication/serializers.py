from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import CustomUser
from datetime import date

class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'first_name', 'last_name', 'country_code', 'phone_number', 'date_of_birth', 'email', 'referral_code' )
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)
    
    def validate_date_of_birth(self, value):
        if value >= date.today():
            raise serializers.ValidationError("Invalid date of birth")
        return value
    
    def validate_phone_number(self, value):
        if len(value) < 9:
            raise serializers.ValidationError("Invalid phone number")
        return value