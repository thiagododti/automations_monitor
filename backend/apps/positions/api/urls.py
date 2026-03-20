from rest_framework.routers import DefaultRouter
from apps.positions.api.views import PositionViewSet

router = DefaultRouter()

router.register("", PositionViewSet, basename="positions")


urlpatterns = router.urls
