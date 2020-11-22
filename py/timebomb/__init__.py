from typing import Union, Callable
from datetime import datetime, timedelta
import logging
from time import sleep


class TimebombError(Exception):
    pass


def warn_after(time: datetime, warn=logging.warning):
    if datetime.now() > time:
        warn("Timebomb expired after {}".format(time.isoformat()))


def slow_after(
    time: datetime,
    delay: Union[float, Callable[[float], float]],
    warn=logging.warning,
    warning_period_days=7,
):
    now = datetime.now()
    if now > time:
        delta = now - time
        if type(delay) == float:
            ms = delay
        else:
            ms = delay(delta.total_seconds() / (24.0 * 60.0 * 60.0))
        warn(
            "Timebomb expired after at {}, slowing request by {}ms.".format(
                time.isoformat(), ms
            )
        )
        sleep(ms * 1.0 / 1000.0)
    elif now + timedelta(days=warning_period_days) > time:
        warn(
            "Warning: Timebomb will soon start slowing request at {}.".format(
                time.isoformat()
            )
        )


def fail_after(time: datetime, warn=logging.warning, warning_period_days=7):
    now = datetime.now()
    if now > time:
        raise TimebombError("Timebomb expired after {}".format(time.isoformat()))
    elif now + timedelta(days=warning_period_days) > time:
        warn("Warning: Timebomb will soon expire at {}.".format(time.isoformat()))
