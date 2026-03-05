from django.urls import path, include

urlpatterns = [
    path('users/', include('apps.users.api.urls')),
    # path('clientes/', include('api.clientes.urls')),
]
