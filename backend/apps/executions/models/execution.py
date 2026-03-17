from django.db import models
from .choices import *


class Execution(models.Model):
    automation = models.ForeignKey(
        "automations.Automation",
        on_delete=models.CASCADE,
        related_name="executions",
        verbose_name='Automação',
    )
    date_start = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Data de inicio',
    )
    date_end = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Data de fim',
    )
    status = models.CharField(
        choices=status_execution,
        max_length=10,
        verbose_name='Status',
        default=ExecutionStatus.INICIADO
    )
    step_counts = models.IntegerField(
        null=True,
        blank=True,
        default=0,
        verbose_name='Contagem de Etapas',
    )
    success_count = models.IntegerField(
        null=True,
        blank=True,
        default=0,
        verbose_name='Contagem de Sucesso',
    )

    def __str__(self):
        return str(self.automation)

    class Meta:
        verbose_name = 'Execução'
        verbose_name_plural = 'Execuções'
        ordering = ['-date_start']
        db_table = "executions"
