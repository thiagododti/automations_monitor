from rest_framework.routers import DefaultRouter
from apps.users.api.views import AuthTokenViewSet


router = DefaultRouter()
router.register("", AuthTokenViewSet, basename="tokens")


urlpatterns = router.urls
