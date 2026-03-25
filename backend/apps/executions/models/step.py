from django.db import models
from .choices import *
from django.db.models import Sum
from decimal import Decimal


class Step(models.Model):
    execution = models.ForeignKey(
        "executions.Execution",
        on_delete=models.CASCADE,
        related_name="steps",
        verbose_name='Execução',
    )
    identification = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name="Identificação",
    )
    status = models.CharField(
        choices=status_execution,
        max_length=10,
        verbose_name='Status',
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
        verbose_name='Tempo de economia em segundos',
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

    def update_execution_totals(self):
        from django.db.models import Sum
        from decimal import Decimal

        execution = self.execution
        completed_steps = execution.steps.filter(date_end__isnull=False)

        totals = completed_steps.aggregate(
            total_automation=Sum('time_automation_seconds'),
            total_manual=Sum('time_manual_seconds'),
            total_economy=Sum('time_economy_seconds'),
            total_potential_time=Sum('potential_time_seconds'),
            total_potential_cost=Sum('potential_cost'),
        )

        execution.time_automation_seconds = totals['total_automation'] or 0
        execution.time_manual_seconds = totals['total_manual'] or 0
        execution.time_economy_seconds = totals['total_economy'] or 0
        execution.potential_time_seconds = totals['total_potential_time'] or 0
        execution.potential_cost = totals['total_potential_cost'] or 0

        # 🔥 custo
        if execution.automation and execution.cost_hour:
            execution.cost_economy = (
                Decimal(execution.time_economy_seconds) / Decimal(3600)
            ) * execution.cost_hour
        else:
            execution.cost_economy = Decimal('0.00')

        # eficiência geral
        if totals['total_automation']:
            execution.efficiency_percent = (
                Decimal(totals['total_manual']) /
                Decimal(totals['total_automation'])
            ) * 100
        else:
            execution.efficiency_percent = Decimal('0.00')

        # execution.save(update_fields=[
        #     'time_automation_seconds',
        #     'time_manual_seconds',
        #     'time_economy_seconds',
        #     'cost_economy',
        #     'potential_time_seconds',
        #     'potential_cost',
        #     'efficiency_percent',
        # ])
        execution.save()

    def save(self, *args, **kwargs):
        # 1. Preenche o tempo manual humano da etapa
        if not self.pk:
            if self.execution and self.execution.automation:
                self.time_manual_seconds = (self.execution.step_time or 0)

        # 2. Calcula o tempo de execução da automação
        if self.date_start and self.date_end and self.time_automation_seconds == 0:
            self.time_automation_seconds = int(
                (self.date_end - self.date_start).total_seconds())

        # 3. Economia de tempo
        if self.date_end and self.time_manual_seconds is not None:
            self.time_economy_seconds = (
                (self.time_manual_seconds or 0)
                - (self.time_automation_seconds or 0)
            )
            ###############################################################################
            # REGRA DE NEGÓCIO: time_economy_seconds é zerado quando negativo pois,
            # mesmo que a automação seja mais lenta, ela ainda libera o humano para
            # outras atividades. Para medir prejuízo real de tempo, remover este bloco.
            if self.time_economy_seconds < 0:
                self.time_economy_seconds = 0
            ################################################################################
        else:
            ###############################################################################
            # REGRA DE NEGÓCIO: Steps sem date_end (erros) não computam economia de tempo.
            # O humano foi poupado de executar a etapa mesmo assim, mas como não houve
            # conclusão, optamos por não contabilizar. Para considerar o tempo manual
            # como economia mesmo em erros, atribuir self.time_manual_seconds aqui.
            ###############################################################################
            self.time_economy_seconds = 0

        # potencial (sempre 100% do manual)
        if self.date_end:
            self.potential_time_seconds = self.time_manual_seconds or 0

            if self.execution.cost_hour:
                self.potential_cost = (
                    Decimal(self.potential_time_seconds) / Decimal(3600)) * self.execution.cost_hour
        else:
            self.potential_time_seconds = 0
            self.potential_cost = Decimal('0.00')

        # eficiência
        if self.date_end and self.time_automation_seconds > 0:
            self.efficiency_percent = (
                Decimal(self.time_manual_seconds) /
                Decimal(self.time_automation_seconds)
            ) * 100
        else:
            self.efficiency_percent = Decimal('0.00')

        old_instance = None
        if self.pk:
            old_instance = Step.objects.filter(pk=self.pk).first()

        super().save(*args, **kwargs)
        if self.date_end and (not old_instance or not old_instance.date_end):
            self.update_execution_totals()

    def __str__(self):
        return str(self.identification)

    class Meta:
        db_table = "steps"
        verbose_name = "Etapa"
        verbose_name_plural = "Etapas"
        ordering = ["-date_start"]
