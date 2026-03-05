from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Modelo personalizado de usuário que estende o AbstractUser do Django.
    Adiciona campos adicionais para armazenar informações específicas do usuário.
    """
    telephone = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        verbose_name="Telephone"
    )
    birthday = models.DateField(
        blank=True,
        null=True,
        verbose_name="Birthday"
    )
    photo = models.ImageField(
        upload_to='user_photos/',
        blank=True,
        null=True,
        verbose_name="User Photo"
    )

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'user'
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ['first_name', 'last_name']
