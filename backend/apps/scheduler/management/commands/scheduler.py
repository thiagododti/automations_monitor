from django.core.management.base import BaseCommand
from apps.scheduler.runner import run_scheduler


class Command(BaseCommand):

    help = "Executa scheduler interno da aplicação"

    def handle(self, *args, **kwargs):

        run_scheduler()
