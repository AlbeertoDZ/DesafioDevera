from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate, SystemMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.agents import load_tools, initialize_agent, AgentType, create_react_agent, AgentExecutor, Tool
from langchain.memory import ConversationBufferMemory
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

import re
import json
# import os
# from dotenv import load_dotenv

from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

## LANGCHAIN LLM SCRAPER AGENT

API_KEY = 'AIzaSyDVIGZFOX0lAdFp5JKUmhzCkiC07ymfrcI'
SERP_API_KEY = '9a522417f7a8d38e7fb19a4be4302a36d2c40dc586e295389efb94a5a948adff'


def scrape_with_playwright(url: str) -> str:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)
        page.wait_for_load_state("networkidle")
        content = page.content()
        browser.close()
        return content  
    

def extract_with_bs4(html: str, selector: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    elements = soup.select(selector)
    return "\n".join([el.get_text(strip=True) for el in elements])

custom_tools = [
    # Tool(name="PlaywrightScraper", func=scrape_with_playwright, description="Usa esto para obtener el HTML renderizado de una página web con JavaScript. Entrada: URL. Salida: HTML.",),
    # Tool(name='BeautifulSoupParser', func=extract_with_bs4, description= "Usa esto para extraer información de HTML usando un selector CSS. Entrada: HTML y selector. Salida: texto extraído.",)
]


llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=API_KEY, temperature=0)
memory = ConversationBufferMemory(memory_key='chat_history')
tools = load_tools(['serpapi','llm-math',], llm=llm, serpapi_api_key=SERP_API_KEY)
agent = initialize_agent(tools=tools + custom_tools,llm=llm, agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION, memory=memory,verbose=True)


url = 'https://milfshakes.es'

system_message_text = f"""
Eres un especialista en ecomerce y tiendas online, tu objetivo es obtener todos los productos que tiene una tienda online mediante web crawling.
Tienes que sacar TODOS los productos, y buscar en las diferentes urls del sitio web de la tienda
Para esto vas a tener que buscar dentro de la web la la pagina de PRODUCTOS, una que te los muestre todos. ES IMPORTANTE QUE BUSESQUES ESTA PAGINA AHI ES DONDE ESTA TODO
La respuesta va a ser un diccionario de cada uno de los productos que contenga informacion de cada producto
LOS PRODUCTOS DEBEN SER REALES, NO PUEDEN SER INVENTADOS

URL : 
{url}

La respuesta se usara para meter los datos en una base de datos asi que debe ser ÚNICAMENTE el siguiente objeto JSON, sin ningún texto antes o después, ni explicaciones, ni comentarios. NO uses markdown, ni comillas triples, ni ningún texto antes o después. SOLO el objeto JSON.:
{{
"producto-1": {{
        "nombre-producto": "...",
        "url-producto": "...",
        "industria" : "...",
        }}
"producto-2": {{
        "nombre-producto": "...",
        "url-producto": "...",
        "industria" : "...",
        }}
...
}}

NO uses markdown, ni comillas triples, ni ningún texto antes o después. SOLO el objeto JSON.
"""


data = agent.invoke(system_message_text)['output']

json_match = re.search(r'\{.*\}', data, re.DOTALL)
if json_match:
    data = json_match.group(0)

data = json.loads(data)

print(data)