from rest_framework import serializers
from .models import CustomUser, Category, AchievementRequest, XPLedger

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'third_name', 'group_name', 'role']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class AchievementRequestSerializer(serializers.ModelSerializer):
    user_details = CustomUserSerializer(source='user', read_only=True)
    category_details = CategorySerializer(source='category', read_only=True)
    curator_details = CustomUserSerializer(source='curator', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = AchievementRequest
        fields = [
            'id', 'user', 'user_details', 'category', 'category_details', 'curator', 'curator_details',
            'text', 'ai_suggested_xp', 'final_xp', 'status', 'status_display',
            'created_at', 'reviewed_at'
        ]
        read_only_fields = ['user', 'curator', 'ai_suggested_xp', 'final_xp', 'status', 'reviewed_at']

class XPLedgerSerializer(serializers.ModelSerializer):
    class Meta:
        model = XPLedger
        fields = '__all__'