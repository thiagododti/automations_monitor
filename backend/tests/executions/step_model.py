from django.test import TestCase
from django.utils import timezone
from datetime import timedelta

from tests.factories.step_factory import StepFactory


class StepModelTest(TestCase):

    def test_create_step(self):
        step = StepFactory.create()

        self.assertIsNotNone(step.id)
        self.assertIsNotNone(step.execution)

    def test_str_method(self):
        step = StepFactory.create()

        self.assertEqual(str(step), step.identification)

    def test_optional_identification(self):
        step = StepFactory.create()
        step.identification = None
        step.save()

        self.assertIsNone(step.identification)

    def test_time_execution_property(self):
        step = StepFactory.create()

        start = timezone.now()
        end = start + timedelta(seconds=15)

        step.date_start = start
        step.date_end = end
        step.save()

        self.assertEqual(step.time_execution, 15)

    def test_ordering(self):
        s1 = StepFactory.create()
        s2 = StepFactory.create()

        steps = list(type(s1).objects.all())

        self.assertGreaterEqual(
            steps[0].date_start,
            steps[1].date_start
        )
