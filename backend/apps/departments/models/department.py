from django.db import models
from django.conf import settings

class Department(models.Model):
    name = models.CharField(
        max_length=200,
        unique=True,
        null=False,
        blank=False,
        verbose_name='Departamento'
    )
    description = models.TextField(
        null=True,
        blank=True,
        verbose_name='Descrição'
    )
    status = models.BooleanField(
        default=True,
        verbose_name="Status"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Criado em'
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Atualizado em'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='departments_updated_by',
        verbose_name='Atualizado por'
    )


    def __str__(self):
        return self.name

    class Meta:
        db_table = 'departaments'
        verbose_name = "Departamento"
        verbose_name_plural = "Departamentos"
        ordering = ['name']