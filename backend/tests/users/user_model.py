from django.test import TestCase
from tests.factories.user_factory import UserFactory


class UserModelTest(TestCase):

    def test_create_user(self):
        user = UserFactory.create()

        self.assertIsNotNone(user.id)
        self.assertEqual(str(user), user.username)

    def test_optional_fields(self):
        user = UserFactory.create()

        self.assertIsNone(user.department)

    def test_default_flags(self):
        user = UserFactory.create()

        self.assertTrue(user.is_active)
        self.assertFalse(user.is_superuser)
