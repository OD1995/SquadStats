def test_get_matches_filter_data(test_client, club_id, team_id):
    for ip in ['True','False']:
        url = f"/combo/get-matches-or-players-filter-data?clubId={club_id}&teamId={team_id}&isPlayers={ip}"
        response = test_client.get(url)
        js = response.json
        for k in [
            'club_seasons',
            'team_seasons',
            'oppositions',
            'players'
        ]:
            assert k in js
        if ip == 'True':
            assert len(js['players']) == 0