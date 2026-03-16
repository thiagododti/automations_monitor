from rest_framework.routers import DefaultRouter, SimpleRouter
from apps.executions.api.views import ExecutionViewSet, LogViewSet, StepViewSet

log_router = SimpleRouter()
log_router.register("logs", LogViewSet, basename="log")

step_router = SimpleRouter()
step_router.register("steps", StepViewSet, basename="step")

execution_router = DefaultRouter()
execution_router.register("", ExecutionViewSet, basename="execution")

urlpatterns = log_router.urls + step_router.urls + execution_router.urls
