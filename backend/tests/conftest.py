import pytest
from app import create_app

@pytest.fixture()
def app():
    app = create_app()
    app.config.update(
        {
            'TESTING' : True
        }
    )
    ## Some setup
    yield app
    ## Some cleanup/resetting of resources

@pytest.fixture()
def test_client(app):
    return app.test_client()

@pytest.fixture()
def runner(app):
    return app.test_cli_runner()

@pytest.fixture()
def club_id():
    return "e804cbb1-8568-4f69-9cc7-7ff907206a48"

@pytest.fixture()
def team_id():
    return "e7e1291b-f60d-4186-87ed-21a2f17d34a6"

@pytest.fixture()
def league_season_id():
    return "7b14de6d-8e0b-4041-8000-41f80c99e0ac"