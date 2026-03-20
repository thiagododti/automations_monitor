from rest_framework.routers import DefaultRouter, SimpleRouter
from django.urls import path
from apps.executions.api.views import ExecutionViewSet, LogViewSet, StepViewSet
from apps.executions.api.views import KPIView, KPIByAutomationView, EvolutionView

log_router = SimpleRouter()
log_router.register("logs", LogViewSet, basename="log")

step_router = SimpleRouter()
step_router.register("steps", StepViewSet, basename="step")

execution_router = DefaultRouter()
execution_router.register("", ExecutionViewSet, basename="execution")

urlpatterns = (
    log_router.urls
    + step_router.urls
    + execution_router.urls
    + [
        path("dashboard/kpis/", KPIView.as_view(), name="dashboard-kpis"),
        path("dashboard/kpis/by-automation/", KPIByAutomationView.as_view(), name="dashboard-kpis-by-automation"),
        path("dashboard/evolution/", EvolutionView.as_view(), name="dashboard-evolution"),
    ]
)