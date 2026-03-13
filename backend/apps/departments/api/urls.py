from rest_framework.routers import DefaultRouter
from apps.departments.api.views import DepartmentViewSet

router = DefaultRouter()

router.register("", DepartmentViewSet, basename="departments")


urlpatterns = router.urls
