from django.db import models
from .choices import *

class Step(models.Model):
    execution = models.ForeignKey(
        "executions.Execution",
        on_delete=models.CASCADE,
        related_name="executions",
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

    @property
    def time_execution(self) -> int:
        time_execution = self.date_end - self.date_start
        return int(time_execution.total_seconds())

    def __str__(self):
        return str(self.identification)

    class Meta:
        db_table = "steps"
        verbose_name = "Etapa"
        verbose_name_plural = "Etapas"
        ordering = ["-date_start"]
