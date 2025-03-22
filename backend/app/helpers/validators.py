from uuid import UUID

def get_club_id_from_shared_club_id(shared_club_id:str):
    first_half = shared_club_id[:18]
    second_half = shared_club_id[-18:]
    middle_whole = shared_club_id[18:54]
    assert middle_whole == first_half + second_half
    return UUID(middle_whole)

def is_valid_uuid(uuid_to_test, version=4):
    """
    Check if uuid_to_test is a valid UUID.
    
     Parameters
    ----------
    uuid_to_test : str
    version : {1, 2, 3, 4}
    
     Returns
    -------
    `True` if uuid_to_test is a valid UUID, otherwise `False`.
    
     Examples
    --------
    >>> is_valid_uuid('c9bf9e57-1685-4c89-bafb-ff5af830be8a')
    True
    >>> is_valid_uuid('c9bf9e58')
    False
    """    
    try:
        uuid_obj = UUID(hex=uuid_to_test, version=version)
    except ValueError:
        return False
    return str(uuid_obj) == uuid_to_test