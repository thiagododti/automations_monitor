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
        verbose_name='Tempo Manual (seg)'
    )
    position = models.ForeignKey(
        'positions.Position',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='automations',
        verbose_name='Cargo',
        db_comment='Campo para armazenar o cargo associado à automação, o cargo deve ser utilizado para calcular o custo de execução da automação com base no custo por hora do cargo e no tempo estimado de execução da automação'
    )
    in_manutention = models.BooleanField(
        default=True,
        verbose_name='Em Manutenção',
        db_comment='Indica se a automação está em manutenção, ou seja, não deve ser executada'
    )
    auth_certificate = models.BooleanField(
        default=True,
        verbose_name="Autentica com Certificado?",
        db_comment='Autentica com Certificado?',

    )
    url_certificate = models.URLField(
        blank=True,
        null=True,
        verbose_name='Url de troca de certificado',
        db_comment="Url usada para efetuar a autenticação de certificados automaticamente."
    )

    history = HistoricalRecords()

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'automations'
        verbose_name = 'Automação'
        verbose_name_plural = 'Automações'
        ordering = ['-created_at']
