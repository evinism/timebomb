import pytest
from datetime import datetime, timedelta
from timebomb import warn_after, slow_after, fail_after, TimebombError


def small_ms_time_diff(end, start):
    return (end - start + 1000000) % 1000000


def test_warn_after_doesnt_warn_before_expired():
    res = None

    def handle_warn(msg):
        nonlocal res
        res = msg

    warn_after(datetime.now() + timedelta(days=1), warn=handle_warn)
    assert res == None


def test_warn_after_warns_after_expired():
    res = None

    def handle_warn(msg):
        nonlocal res
        res = msg

    warn_after(datetime.now() - timedelta(days=1), warn=handle_warn)
    assert res != None


def test_slow_after_warns_when_in_timeframe():
    res = None

    def handle_warn(msg):
        nonlocal res
        res = msg

    slow_after(datetime.now() + timedelta(days=1), 10.0, warn=handle_warn)
    assert res != None


def test_slow_after_slows_after_expired():
    start = datetime.now().microsecond
    slow_after(datetime.now() - timedelta(days=1), 10.0)
    end = datetime.now().microsecond
    diff = small_ms_time_diff(end, start)
    assert diff > 5000
    assert diff < 15000


def test_slow_after_slows_via_lambda():
    start = datetime.now().microsecond
    slow_after(datetime.now() - timedelta(days=5), lambda t: t * 10)
    end = datetime.now().microsecond
    diff = small_ms_time_diff(end, start)
    assert diff > 40000
    assert diff < 60000


def test_fail_after_warns_when_in_timeframe():
    res = None

    def handle_warn(msg):
        nonlocal res
        res = msg

    fail_after(datetime.now() + timedelta(days=1), warn=handle_warn)
    assert res != None


def test_fail_after_fails_after():
    with pytest.raises(TimebombError):
        fail_after(datetime.now() - timedelta(days=1), 10)
