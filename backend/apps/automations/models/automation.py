from django.db import models
from django.conf import settings

class Automation(models.Model):
    name = models.CharField(
        max_length=255,
        verbose_name='Nome da Automação'
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name='Descrição da Automação'
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name='Ativa'
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
        blank=True,
        null=True,
        related_name='automations_updated_by',
        verbose_name='Atualizado por'
    )
    manual_time = models.BigIntegerField(
        blank=True,
        null=True,
        verbose_name='Tempo Manual (seg)'
    )

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'automations'
        verbose_name = 'Automação'
        verbose_name_plural = 'Automações'
        ordering = ['-created_at']