from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time
from bs4 import BeautifulSoup


def getSoup(en_word):
    # Configuration des options du navigateur
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Exécuter Chrome en mode headless (sans interface graphique)
    chrome_options.add_argument("--disable-gpu")  # Désactiver l'accélération matérielle

    # Chemin vers le pilote Chrome WebDriver
    webdriver_path = "./chromedriver/chromedirve.exe"

    # Configuration du navigateur WebDriver
    chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
    driver = webdriver.Chrome(executable_path=webdriver_path, options=chrome_options)

    # Charger l'URL
    url = "https://www.deepl.com/fr/translator#en/fr/"+en_word
    driver.get(url)
    # time.sleep(10)

    # Récupérer le code HTML de la page
    time.sleep(1)
    html = driver.page_source
    driver.quit()

    soup = BeautifulSoup(html, 'html.parser')

    return soup




def getDetailsTranslation(soup):
    soup = soup.select('[data-testid="translator-dict-content"]')
    #print(soup)
    if len(soup) >= 1:
        return soup[0]
    return []


def search_translation_examples(soup):
    dit = {}

    parent_spans_with_text_en = soup.find_all('span', text=True, lang="en") #les exemples   
    parent_spans_with_text_fr = soup.find_all('span', text=True, lang="fr") #les exemples

    for i in range(len(parent_spans_with_text_en)):
        dit[parent_spans_with_text_en[i].text.replace("\n", "")] = parent_spans_with_text_fr[i].text.replace("\n", "")
    
    return dit

def search_translation_words(soup):
    tab = []
    parent_as_with_text = soup.find_all('a', text=True, id=True) #traductions littérales

    # Afficher les éléments récupérés
    for a in parent_as_with_text:
        tab.append(a.text.replace("\n", ""))
    return tab

def getSimpleTraduction(soup):
    element = soup.find(attrs={"_d-id": "8"})
    return element.text.replace("\n", "")