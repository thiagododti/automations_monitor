from django.db import models
from simple_history.models import HistoricalRecords


nivel_choices = [
    ('junior', 'Junior'),
    ('pleno', 'Pleno'),
    ('senior', 'Senior'),
    ('supervisor', 'Supervisor'),
    ('gerencia', 'Gerência'),
    ('diretoria', 'Diretoria'),
]


class Position(models.Model):
    name = models.CharField(
        max_length=255
    )
    description = models.TextField(
        blank=True,
        null=True
    )
    nivel = models.CharField(
        max_length=50,
        choices=nivel_choices
    )
    cost_hour = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name='Custo por Hora',
        db_comment='Campo para armazenar o custo por hora do cargo'
    )

    history = HistoricalRecords()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Cargo"
        verbose_name_plural = "Cargos"
        db_table = "positions"
        ordering = ['name']
