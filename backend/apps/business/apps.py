from django.apps import AppConfig


class BusinessConfig(AppConfig):
    name = 'apps.business'

    # Signals de criação após migrações.
    def ready(self):
        import apps.business.signals.createbusiness