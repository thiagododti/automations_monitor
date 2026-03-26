from django.db import models
from django.contrib.auth.models import AbstractUser
from apps.users.managers import UserManager


class User(AbstractUser):
    """
    Modelo personalizado de usuário que estende o AbstractUser do Django.
    Adiciona campos adicionais para armazenar informações específicas do usuário.
    """
    telephone = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        verbose_name="Telefone"
    )
    birthday = models.DateField(
        blank=True,
        null=True,
        verbose_name="Aniversário"
    )
    photo = models.ImageField(
        upload_to='user_photos/',
        blank=True,
        null=True,
        verbose_name="Foto do Perfil"
    )
    department = models.ForeignKey(
        "departments.Department",
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        verbose_name="Departamento",
        related_name='users',
    )
    updated_by = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_users"
    )

    objects: UserManager = UserManager()  # type: ignore

    REQUIRED_FIELDS = [
        'email',
        'first_name',
        'last_name',
        'telephone',
        'birthday'
    ]




    def __str__(self):
        return self.username

    class Meta:
        db_table = 'users'
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"
        ordering = ['first_name', 'last_name']
