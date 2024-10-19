import requests
from bs4 import BeautifulSoup

class Scraper:

    def __init__(self):
        pass    

    def get_soup(
        self,
        url:str
    ) -> BeautifulSoup:
        req = requests.get(url)
        if req.ok:
            return BeautifulSoup(req.text, 'html.parser')
        return Exception(f"Status Code: {req.status_code} - Text: {req.text}")