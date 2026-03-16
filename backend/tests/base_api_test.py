from rest_framework.test import APITestCase
from tests.factories.user_factory import UserFactory


class BaseAPITestCase(APITestCase):

    def setUp(self):
        self.user = UserFactory.create()
        self.client.force_authenticate(self.user)