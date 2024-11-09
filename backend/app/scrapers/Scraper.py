from aiohttp import ClientSession
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
    
    # def get_async_soup(
    #     self,
    #     session:ClientSession,
    #     url:str
    # ) -> BeautifulSoup:
    #     req = session.get(url)
    #     if req.ok:
    #         return BeautifulSoup(req.text, 'html.parser')
    #     return Exception(f"Status Code: {req.status_code} - Text: {req.text}")
            
    def get_text(
        self,
        url:str
    ) -> str:
        req = requests.get(url)
        return req.text