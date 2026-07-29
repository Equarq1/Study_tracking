from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from django.db.models import Sum
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from django.db.models import Sum
from django.utils import timezone
from django.contrib.auth.hashers import make_password

from .models import CustomUser, Category, AchievementRequest, XPLedger
from .serializers import CategorySerializer, AchievementRequestSerializer, CustomUserSerializer
from .ai_service import analyze_achievement_with_ai
from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Проверка наличия данных
        if not email or not password:
            return Response(
                {"error": "Email и password обязательны."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Очистка email (удаление пробелов)
        email = email.strip().lower()
        
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "Пользователь с таким именем не найден."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Проверка пароля
        if not user.check_password(password):
            return Response(
                {"error": "Неверный пароль."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Проверка активности пользователя
        if not user.is_active:
            return Response(
                {"error": "Учетная запись не активирована."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Создание токенов
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': CustomUserSerializer(user).data
        }, status=status.HTTP_200_OK)

class IsCurator(BasePermission):
    """
    Проверка прав: доступ разрешен только пользователям с ролью 'curator'.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'curator'


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class AchievementRequestViewSet(viewsets.ModelViewSet):
    serializer_class = AchievementRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = AchievementRequest.objects.filter(user=self.request.user)
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        return qs
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = AchievementRequest.objects.filter(user=self.request.user)
        status_param = self.request.query_params.get('status')
        if status_param:
            qs = qs.filter(status=status_param)
        return qs

    def perform_create(self, serializer):
        # 1. Получаем данные один раз
        category = serializer.validated_data.get('category')
        text = serializer.validated_data.get('text')

        # 2. Получаем ответ от AI
        # analyze_achievement_with_ai теперь возвращает словарь {"xp": int, "explanation": str}
        ai_result = analyze_achievement_with_ai(category.name, text)

        # 3. Безопасно извлекаем XP
        # Если AI вернул словарь, берем XP. Если произошла ошибка (и вернулся дефолт), берем его же.
        ai_xp = ai_result.get('xp', 20)

        # 4. Сохраняем объект в базу один раз
        serializer.save(
            user=self.request.user,
            ai_suggested_xp=ai_xp,
            status='pending'
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status != 'pending':
            return Response(
                {"error": "Удалять можно только заявки в статусе 'pending'"},
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CuratorRequestViewSet(viewsets.ModelViewSet):
    queryset = AchievementRequest.objects.all().order_by('-created_at')
    serializer_class = AchievementRequestSerializer
    permission_classes = [IsCurator]

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        instance = self.get_object()
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status != 'pending':
            return Response(
                {"error": "Удалять можно только заявки в статусе 'pending'"},
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CuratorRequestViewSet(viewsets.ModelViewSet):
    queryset = AchievementRequest.objects.all().order_by('-created_at')
    serializer_class = AchievementRequestSerializer
    permission_classes = [IsCurator]

    def update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        instance = self.get_object()

        if instance.status != 'pending':
            return Response(
                {"error": "Заявка уже обработана и не может быть изменена."},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = request.data
        new_status = data.get('status')
        curator_profile = getattr(request.user, 'curator_profile', None)

        if new_status == 'approved':
            final_xp = data.get('final_xp', instance.ai_suggested_xp)
            if final_xp is None:
                return Response(
                    {"error": "Не указан final_xp и отсутствует рекомендация ИИ."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            instance.final_xp = int(final_xp)
            instance.status = 'approved'
            instance.reviewed_at = timezone.now()
            instance.curator = request.user
            instance.save()

            XPLedger.objects.create(
                student=instance.user,
                request=instance,
                category=instance.category,
                xp_amount=instance.final_xp
            )
            return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)

        elif new_status == 'rejected':
            instance.status = 'rejected'
            instance.reviewed_at = timezone.now()
            instance.curator = request.user
            instance.save()
            return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        username = data.get('username')
        password = data.get('password')
        email = data.get('email', '').strip().lower()  # Нормализация email
        # role = data.get('role', 'student')
        try: 
            name = username.split()
            first_name = name[1]
            last_name = name[0]
            third_name = name[2]
        except ValueError: 
            return Response({"error": "Поле ФИО заполнено некорректно."},
                            status=status.HTTP_400_BAD_REQUEST)

        group = data.get('group', '')

        if not username or not password or not email:
            return Response({"error": "Поля username, password и email обязательны."},
                            status=status.HTTP_400_BAD_REQUEST)

        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Пользователь с таким email уже существует."}, status=status.HTTP_400_BAD_REQUEST)

        # if role not in [choice[0] for choice in CustomUser.ROLE_CHOICES]:
        #     return Response({"error": "Недопустимая роль."}, status=status.HTTP_400_BAD_REQUEST)

        user = CustomUser.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            # role=role,
            first_name=first_name,
            last_name=last_name,
            third_name=third_name,
            group_name=group
        )
        return Response({"status": "success", "user": CustomUserSerializer(user).data}, status=status.HTTP_201_CREATED)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(CustomUserSerializer(request.user).data)

    def patch(self, request):
        serializer = CustomUserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ProfileStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stats = XPLedger.objects.filter(student=request.user).aggregate(total_xp=Sum('xp_amount'))
        return Response({"total_xp": stats.get('total_xp') or 0}, status=status.HTTP_200_OK)