from django.test import TestCase
from tests.factories.department_factory import DepartmentFactory


class DepartmentModelTest(TestCase):

    def test_create_department(self):
        department = DepartmentFactory.create()

        self.assertIsNotNone(department.id)
        self.assertEqual(str(department), department.name)

    def test_optional_fields(self):
        department = DepartmentFactory.create()

        self.assertIsNotNone(department.name)
        self.assertTrue(department.status)

    def test_ordering(self):
        dept1 = DepartmentFactory.create()
        dept2 = DepartmentFactory.create()

        departments = list(type(dept1).objects.all())

        self.assertLessEqual(departments[0].name, departments[1].name)
