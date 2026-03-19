from decimal import Decimal

from django.db import models
from .choices import *


class Execution(models.Model):
    automation = models.ForeignKey(
        "automations.Automation",
        on_delete=models.PROTECT,
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
        default=0,
        verbose_name='Contagem de Etapas',
    )
    success_count = models.IntegerField(
        default=0,
        verbose_name='Contagem de Sucesso',
    )
    error_count = models.IntegerField(
        default=0,
        blank=True,
        verbose_name='Contagem de Erros',
    )

    time_automation_seconds = models.IntegerField(
        default=0,
        verbose_name='Tempo de execução da automação em segundos',
    )
    time_manual_seconds = models.IntegerField(
        default=0,
        verbose_name='Tempo de execução manual em segundos',
    )
    time_economy_seconds = models.IntegerField(
        default=0,
        verbose_name='Tempo economizado em segundos',
    )
    cost_economy = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Economia de custo',
        default=Decimal('0.00')
    )
    potential_time_seconds = models.IntegerField(
        default=0,
        verbose_name='Tempo potencial economizado (seg)'
    )
    potential_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name='Custo potencial economizado'
    )
    efficiency_percent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name='Eficiência (%)'
    )

    def save(self, *args, **kwargs):
        if self.automation.in_manutention:
            self.status = ExecutionStatus.TESTE
        super().save(*args, **kwargs)

    def __str__(self):
        return str(self.automation)

    class Meta:
        verbose_name = 'Execução'
        verbose_name_plural = 'Execuções'
        ordering = ['-date_start']
        db_table = "executions"
