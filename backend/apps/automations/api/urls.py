from rest_framework.routers import DefaultRouter
from apps.automations.api.views import AutomationViewSet

router = DefaultRouter()

router.register("", AutomationViewSet, basename="automations")

urlpatterns = router.urls
