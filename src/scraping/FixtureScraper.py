import requests
from bs4 import BeautifulSoup

class FixtureScraper:

    def __get_soup(url:str) -> BeautifulSoup:
        req = requests.get(url)
        if req.ok:
            return BeautifulSoup(req.text, 'lxml')
        return Exception(f"Status Code: {req.status_code} - Text: {req.text}")

    def save_data(data):
        pass