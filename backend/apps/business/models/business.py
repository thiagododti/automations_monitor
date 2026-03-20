from django.db import models


class Business(models.Model):
    """
    Modelo de exemplo para representar uma entidade de negócio.
    Este modelo pode ser expandido com campos adicionais conforme necessário.
    """
    name = models.CharField(
        max_length=255,
        verbose_name="Nome do Negócio"
    )
    cnpj = models.CharField(
        max_length=14,
        unique=True,
        verbose_name="CNPJ"
    )
    logo = models.ImageField(
        upload_to='business_logos/',
        blank=True,
        null=True,
        verbose_name="Logo do Negócio"
    )
    certificado = models.FileField(
        upload_to='business_certificados/',
        blank=True,
        null=True,
        verbose_name="Certificado Digital"
    )
    description = models.TextField(
        blank=True,
        null=True,
        verbose_name="Descrição do Negócio"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Data de Criação"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Data de Atualização"
    )
    updated_by = models.ForeignKey(
        "users.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="updated_businesses",
        verbose_name="Atualizado por"
    )
    # Colunas para gerenciar os dados dos certificados digitais!
    certificate_expire = models.DateTimeField(
        null=True,
        blank=True,
    )
    subject_cn = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )
    subject_c = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )
    subject_o = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )
    issuer_cn = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )
    issuer_c = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )
    issuer_o = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )


    def __str__(self):
        return self.name

    class Meta:
        db_table = 'business'
        verbose_name = "Negócio"
        verbose_name_plural = "Negócios"
