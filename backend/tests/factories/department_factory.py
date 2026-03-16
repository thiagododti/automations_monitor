from apps.departments.models import Department
from tests.factories.user_factory import UserFactory


class DepartmentFactory:

    counter = 0

    @classmethod
    def create(cls, user=None):

        if not user:
            user = UserFactory.create()

        cls.counter += 1

        return Department.objects.create(
            name=f"Departamento {cls.counter}",
            updated_by=user
        )
