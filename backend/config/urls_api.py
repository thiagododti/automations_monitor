from django.urls import path, include

urlpatterns = [
    path('users/', include('apps.users.api.urls')),
    path('departments/', include('apps.departments.api.urls')),
    path('automations/', include('apps.automations.api.urls')),
    path('executions/', include('apps.executions.api.urls')),
    path('business/', include('apps.business.api.urls')),
    path('positions/', include('apps.positions.api.urls')),
]
