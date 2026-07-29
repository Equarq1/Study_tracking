from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Curator, Category, AchievementRequest, XPLedger

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Системные данные проекта', {'fields': ('third_name', 'group_name', 'role')}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'group_name')
    list_filter = ('role', 'group_name')

@admin.register(Curator)
class CuratorAdmin(admin.ModelAdmin):
    list_display = ('user', 'subject')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'color')

@admin.register(AchievementRequest)
class AchievementRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'category', 'status', 'created_at')
    list_filter = ('status', 'category')

@admin.register(XPLedger)
class XPLedgerAdmin(admin.ModelAdmin):
    list_display = ('student', 'request', 'category', 'xp_amount', 'created_at')
    list_filter = ('category',)