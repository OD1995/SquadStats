def test_get_club(test_client, club_id):
    response = test_client.get(f"/club/get/{club_id}")
    assert response.status_code == 200

def test_get_club_overview_stats(test_client, club_id):
    response = test_client.get(f"/club/get-club-overview-stats/{club_id}")
    assert response.status_code == 200
    js = response.json
    for k in ['matches','players']:
        assert k in js
        assert len(js[k]) == 2

def test_get_player_information(test_client, club_id):
    response = test_client.get(f"/club/get-player-information/{club_id}")
    assert response.status_code == 200
    js = response.json
    for k in ['club_name','players']:
        assert k in js