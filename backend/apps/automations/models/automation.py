from django.db import models
from django.conf import settings
from simple_history.models import HistoricalRecords


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
    department = models.ForeignKey(
        'departments.Department',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='automations',
        verbose_name='Departamento'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='updated_automations',
        verbose_name='Atualizado por'
    )
    manual_time = models.BigIntegerField(
        default=0,
        blank=True,
        null=True,
        verbose_name='Tempo Manual (seg)'
    )
    execution_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name='Custo de Execução',
        db_comment='Campo para armazenar o custo estimado de execução da automação o custo deve ser calculado com base na etapa da execução'
    )
    in_manutention = models.BooleanField(
        default=True,
        verbose_name='Em Manutenção',
        db_comment='Indica se a automação está em manutenção, ou seja, não deve ser executada'
    )

    history = HistoricalRecords()

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'automations'
        verbose_name = 'Automação'
        verbose_name_plural = 'Automações'
        ordering = ['-created_at']
