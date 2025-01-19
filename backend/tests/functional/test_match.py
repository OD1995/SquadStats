def test_get_current_matches(test_client, team_id, league_season_id):
    response = test_client.get(f"/match/get-current-matches/{team_id}/{league_season_id}")
    assert response.status_code == 200