def test_get_team_player_information(test_client, team_id):
    response = test_client.get(f"/team/get-player-information/{team_id}")
    assert response.status_code == 200
    js = response.json
    for k in [
        'team_name',
        'club_id',
        'players'
    ]:
        assert k in js