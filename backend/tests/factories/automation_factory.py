from apps.automations.models import Automation
from tests.factories.department_factory import DepartmentFactory
from tests.factories.user_factory import UserFactory


class AutomationFactory:

    @staticmethod
    def create(user=None, department=None):

        if not user:
            user = UserFactory.create()

        if not department:
            department = DepartmentFactory.create(user)

        return Automation.objects.create(
            name="Automation Test",
            department=department,
            updated_by=user
        )
