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
        null=True,
        blank=True,
        default=0,
        verbose_name='Tempo de execução da automação em segundos',
    )
    time_manual_seconds = models.IntegerField(
        null=True,
        blank=True,
        default=0,
        verbose_name='Tempo de execução manual em segundos',
    )
    time_economy_seconds = models.IntegerField(
        null=True,
        blank=True,
        default=0,
        verbose_name='Tempo de economia em segundos',
    )

    def update_execution_totals(self):
        from django.db.models import Sum
        from decimal import Decimal

        execution = self.execution

        totals = execution.steps.aggregate(
            total_automation=Sum('time_automation_seconds'),
            total_manual=Sum('time_manual_seconds'),
            total_economy=Sum('time_economy_seconds'),
        )

        execution.time_automation_seconds = totals['total_automation'] or 0
        execution.time_manual_seconds = totals['total_manual'] or 0
        execution.time_economy_seconds = totals['total_economy'] or 0

        # 🔥 custo
        if execution.automation and execution.automation.execution_cost:
            execution.cost_economy = (
                Decimal(execution.time_economy_seconds) / Decimal(3600)
            ) * execution.automation.execution_cost
        else:
            execution.cost_economy = Decimal('0.00')

        execution.save(update_fields=[
            'time_automation_seconds',
            'time_manual_seconds',
            'time_economy_seconds',
            'cost_economy',
        ])

    def save(self, *args, **kwargs):
        # 1. Preencher tempo manual na criação
        if not self.pk:
            if self.execution and self.execution.automation:
                self.time_manual_seconds = (
                    self.execution.automation.manual_time or 0
                )

        # 2. Calcular automação (uma vez só)
        if self.date_start and self.date_end and self.time_automation_seconds == 0:
            self.time_automation_seconds = int(
                (self.date_end - self.date_start).total_seconds()
            )

        # 3. Economia (sempre consistente)
        if self.time_manual_seconds is not None:
            self.time_economy_seconds = (
                (self.time_manual_seconds or 0)
                - (self.time_automation_seconds or 0)
            )

            if self.time_economy_seconds < 0:
                self.time_economy_seconds = 0
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
