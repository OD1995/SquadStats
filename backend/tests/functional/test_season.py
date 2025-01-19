def test_get_team_seasons(test_client, team_id):
    response = test_client.get(f"/season/get-team-seasons/{team_id}")
    assert response.status_code == 200