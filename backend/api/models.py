from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('student', 'Студент'),
        ('curator', 'Куратор'),
        ('admin', 'Администратор'),
    ]

    third_name = models.CharField(max_length=150, blank=True, verbose_name="Отчество")
    email = models.EmailField(unique=True, verbose_name="Email")
    group_name = models.CharField(max_length=50, blank=True, verbose_name="Группа")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student', verbose_name="Роль")

    # Глушим конфликт E304
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='customuser_set',
        blank=True,
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='customuser_set',
        blank=True,
        verbose_name='user permissions',
    )

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"


class Curator(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='curator_profile')
    subject = models.CharField(max_length=255, blank=True, verbose_name="Предмет/Направление")

    class Meta:
        verbose_name = "Куратор"
        verbose_name_plural = "Кураторы"

    def __str__(self):
        return f"Куратор: {self.user.get_full_name()}"


class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название")
    color = models.CharField(max_length=7, default="#4A90D9", verbose_name="Цвет (HEX)")

    class Meta:
        verbose_name = "Категория"
        verbose_name_plural = "Категории"

    def __str__(self):
        return self.name


class AchievementRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Ожидает решения'),
        ('approved', 'Утверждено'),
        ('rejected', 'Отклонено'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='requests', verbose_name="Студент")
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='requests', verbose_name="Категория")
    curator = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviewed_requests', verbose_name="Куратор")
    text = models.TextField(verbose_name="Описание достижения")
    ai_suggested_xp = models.IntegerField(null=True, blank=True, verbose_name="Рекомендация ИИ")
    final_xp = models.IntegerField(null=True, blank=True, verbose_name="Итоговые XP")
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Заявка на достижение"
        verbose_name_plural = "Заявки на достижения"

    def __str__(self):
        return f"Заявка #{self.id} от {self.user.username} [{self.status}]"


class XPLedger(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='xp_entries')
    request = models.ForeignKey(AchievementRequest, on_delete=models.CASCADE, related_name='ledger_entries')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='xp_entries')
    xp_amount = models.IntegerField(verbose_name="Количество XP")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Запись XP"
        verbose_name_plural = "Леджер XP"

    def __str__(self):
        return f"+{self.xp_amount} XP -> {self.student.username} ({self.category.name})"