from django.db.models.signals import post_migrate
from django.db.models.signals import post_migrate
from django.dispatch import receiver

from rest_framework.authtoken.models import Token
from django.conf import settings

@receiver(post_migrate)
def create_business(sender, **kwargs):
    empresas = [
        {
            "name": "Alldax I",
            "cnpj": "08880518000179",
        },
        {
            "name": "Alldax II",
            "cnpj": "19434956000120",
        },
        {
            "name": "Alldax III",
            "cnpj": "41246946000110",
        },
        {
            "name": "Tax All I",
            "cnpj": "18619561000139",
        }
    ]

    if not settings.TESTING:
        from apps.business.models import Business
        for empresa in empresas:
            if not Business.objects.filter(cnpj=empresa['cnpj']).exists():
                print(f"Iniciando a criação da empresa {empresa['name']} por Signal, caso deseje remover essa ação remova do arquivo /apps/business/apps a ação do signal!")
                business = Business.objects.create(
                    name=empresa['name'],
                    cnpj=empresa['cnpj']
                )
                if business:
                    print(f"Empresa: {business.name} - {business.cnpj} criado com sucesso.")
