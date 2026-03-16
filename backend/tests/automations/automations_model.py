from django.test import TestCase
from tests.factories.automation_factory import AutomationFactory


class AutomationModelTest(TestCase):

    def test_create_automation(self):
        automation = AutomationFactory.create()

        self.assertIsNotNone(automation.id)
        self.assertEqual(str(automation), automation.name)

    def test_optional_fields(self):
        automation = AutomationFactory.create()

        self.assertIsNotNone(automation.department)
        self.assertTrue(automation.is_active)

    def test_ordering(self):
        a1 = AutomationFactory.create()
        a2 = AutomationFactory.create()

        automations = list(type(a1).objects.all())

        self.assertGreaterEqual(
            automations[0].created_at,
            automations[1].created_at
        )