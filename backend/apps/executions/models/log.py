from django.db import models
from .choices import *

class Log(models.Model):
    execution = models.ForeignKey(
        "Execution",
        on_delete=models.CASCADE,
        related_name="steps",
        verbose_name='Execução',
    )
    description = models.CharField(
        max_length=250,
        blank=True,
        null=True,
        verbose_name="Descrição"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Criado em"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Atualizado em"
    )

    class Meta:
        db_table = 'logs'
        ordering = ['-created_at']
        verbose_name = 'Log'
        verbose_name_plural = 'Logs'

