from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CategoryViewSet, AchievementRequestViewSet, CuratorRequestViewSet,
    ProfileView, ProfileStatsView, RegisterView, LoginView
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'requests', AchievementRequestViewSet, basename='student-requests')
router.register(r'curator/requests', CuratorRequestViewSet, basename='curator-requests')

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/stats/', ProfileStatsView.as_view(), name='profile-stats'),
    path('auth/login/', LoginView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
]