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
        db_comment="Data fim da execução, preenchida quando a execução for finalizada (Sucesso ou Alerta)"
    )
    cost_hour = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name='Custo de Execução',
        db_comment='Custo hora do cargo especificado na automação'
    )
    step_time = models.IntegerField(
        default=0,
        db_comment="Tempo manual que o humano leva para executar a etapa"
    )
    status = models.CharField(
        choices=status_execution,
        max_length=10,
        verbose_name='Status'
    )
    step_counts = models.IntegerField(
        default=0,
        verbose_name='Contagem de Etapas',
        db_comment='Contagem de Etapas'
    )
    success_count = models.IntegerField(
        default=0,
        verbose_name='Contagem de Sucesso das etapas',
        db_comment='Contagem de Sucesso das etapas'
    )
    error_count = models.IntegerField(
        default=0,
        blank=True,
        verbose_name='Contagem de Erros das etapas',
        db_comment="Contagem de Erros das etapas"
    )

    time_automation_seconds = models.IntegerField(
        default=0,
        verbose_name='Tempo de execução da automação em segundos',
        db_comment="Total de tempo acumulado das etapas que registraram date_end(Sucesso ou Alerta)"

    )
    time_manual_seconds = models.IntegerField(
        default=0,
        verbose_name='Tempo de execução manual em segundos',
        db_comment="Total de tempo acumulado das etapas que registraram date_end(Sucesso ou Alerta)"
    )
    time_economy_seconds = models.IntegerField(
        default=0,
        verbose_name='Tempo economizado em segundos',
        db_comment="Total de tempo economizado das etapas que registraram date_end(Sucesso ou Alerta) - (time_automation_seconds - time_manual_seconds)"
    )
    cost_economy = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Economia de custo',
        default=Decimal('0.00'),
        db_comment='Economia de custo'

    )
    potential_time_seconds = models.IntegerField(
        default=0,
        verbose_name='Tempo potencial economizado (seg)',
        db_comment='Total de tempo acumulado que foi automatizado do processo humano'
    )
    potential_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name='Custo potencial economizado',
        db_comment="Custo potencial economizado - Total de tempo acumulado que foi automatizado do processo humano * custo hora do cargo especificado na automação"
    )
    efficiency_percent = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name='Eficiência (%)',
        db_comment="Eficiencia da automação em relação ao processo humano"
    )

    def save(self, *args, **kwargs):
        if not self.pk:
            if self.automation and self.automation.position:
                self.cost_hour = self.automation.position.cost_hour or 0
            else:
                self.cost_hour = 0

            if self.automation and self.automation.manual_time:
                self.step_time = self.automation.manual_time

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
