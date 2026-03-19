from rest_framework.routers import DefaultRouter
from apps.business.api.views import BusinessViewSet

router = DefaultRouter()

router.register("", BusinessViewSet, basename="businesses")


urlpatterns = router.urls
