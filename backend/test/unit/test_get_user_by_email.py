import pytest
from unittest.mock import MagicMock

from src.controllers.usercontroller import UserController


@pytest.mark.unit
def test_get_user_by_email_tc01_invalid_email_raises_value_error():
    dao = MagicMock()
    controller = UserController(dao=dao)

    with pytest.raises(ValueError):
        controller.get_user_by_email("not-an-email")


@pytest.mark.unit
def test_get_user_by_email_tc02_valid_email_dao_empty_returns_none():
    dao = MagicMock()
    controller = UserController(dao=dao)
    dao.find.return_value = []

    result = controller.get_user_by_email("a@b.c")

    assert result is None


@pytest.mark.unit
def test_get_user_by_email_tc03_valid_email_dao_one_returns_user():
    dao = MagicMock()
    controller = UserController(dao=dao)
    user = {"id": "u1", "email": "a@b.c"}
    dao.find.return_value = [user]

    result = controller.get_user_by_email("a@b.c")

    assert result == user


@pytest.mark.unit
def test_get_user_by_email_tc04_valid_email_dao_multiple_warning_and_first(capsys):
    dao = MagicMock()
    controller = UserController(dao=dao)
    user1 = {"id": "u1", "email": "a@b.c"}
    user2 = {"id": "u2", "email": "a@b.c"}
    dao.find.return_value = [user1, user2]

    result = controller.get_user_by_email("a@b.c")
    captured = capsys.readouterr()

    assert result == user1
    assert "more than one user found with mail a@b.c" in captured.out


@pytest.mark.unit
def test_get_user_by_email_tc05_valid_email_dao_raises_propagates():
    dao = MagicMock()
    controller = UserController(dao=dao)
    dao.find.side_effect = Exception("db down")

    with pytest.raises(Exception, match="db down"):
        controller.get_user_by_email("a@b.c")
