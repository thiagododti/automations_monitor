import time
from django.utils import timezone

from apps.scheduler.jobs import check_stuck_executions


SCHEDULE = [

    {
        "func": check_stuck_executions,
        "interval": 300,
        "last_run": None,
    },

]


def run_scheduler():

    while True:

        now = timezone.now().timestamp()

        for job in SCHEDULE:

            if (
                job["last_run"] is None
                or now - job["last_run"] >= job["interval"]
            ):

                job["func"]()
                job["last_run"] = now

        time.sleep(5)
