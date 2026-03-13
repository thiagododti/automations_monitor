from rest_framework.routers import DefaultRouter
from apps.executions.api.views import ExecutionViewSet,LogViewSet,StepViewSet

router = DefaultRouter()

router.register("", ExecutionViewSet, basename="execution")
router.register("logs", LogViewSet, basename="log")
router.register("steps", StepViewSet, basename="step")


urlpatterns = router.urls
