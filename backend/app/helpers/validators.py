def get_club_id_from_shared_club_id(shared_club_id:str):
    first_half = shared_club_id[:18]
    second_half = shared_club_id[-18:]
    middle_whole = shared_club_id[18:54]
    assert middle_whole == first_half + second_half
    return middle_whole