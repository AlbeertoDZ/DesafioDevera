
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import load_tools, initialize_agent, AgentType
from langchain.memory import ConversationBufferMemory
from firecrawl import AsyncFirecrawlApp
from dotenv import load_dotenv
import os
import asyncio
import re
import json


dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

API_KEY = os.getenv("GOOGLE_API_KEY")
FIRECRAWL_KEY = os.getenv("FIRECRAWL_API_KEY")
SERP_API_KEY = os.getenv('SERP_API_KEY')

# url = 'https://cookiechips.com'




def product_lister(url:str):


    ########## MAPPER ##########


    async def mapper():
        app = AsyncFirecrawlApp(api_key=FIRECRAWL_KEY)
        response = await app.map_url(
            url=url,
            include_subdomains=True
        )
        return response


    links = asyncio.run(mapper()).links


    ########## FILTER AGENT ##########


    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=API_KEY, temperature=0)
    memory = ConversationBufferMemory(memory_key='chat_history')
    tools = load_tools(['serpapi','llm-math'], llm=llm, serpapi_api_key=SERP_API_KEY)
    agent = initialize_agent(tools=tools,llm=llm, agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION, memory=memory,verbose=True, handle_parsing_errors=True)



    filter_message = f"""
    Eres un especialsita en recopilacion de datos de productos de tiendas online. Tu objetivo es a partir de una lista de urls definin cuales de los links son de productos de la tienda

    Tu objetivo sera descartar todas las url que no sean de productos. Miraras en la lista de las urls y escojeras SOLO LAS QUE SEAN DE PRODUCTOS. Ten en cuenta que los productos pueden estar en varios idiomas

    Es posible que exsistan productos repetidos en diferentes links o idiomas, deberas dercartar los productos que esten repetidos y quedarte solo con uno de ellos, si estan en diferentes idiomas escoje solo los que esten en español

    Lista de URLs : 
    {links}

    La respuesta se usara para meter los datos en una base de datos asi que debe ser ÚNICAMENTE el siguiente objeto JSON, sin ningún texto antes o después, ni explicaciones, ni comentarios.

    {{
    "links" : [....]
    }}

    """


    data = agent.invoke(filter_message)['output']

    json_match = re.search(r'\{.*\}', data, re.DOTALL)
    if json_match:
        data = json_match.group(0)

    data = json.loads(data)
    product_links = data['links']


    ########## SCRAPPER ##########

    async def scrapper():
        app = AsyncFirecrawlApp(api_key=FIRECRAWL_KEY)
        data = await app.batch_scrape_urls(
            product_links, 
            formats=['json'],
            json_options={
                'prompt' : 'Extract the title, sourceURL and Main Image from the page',
                'schema': {
                    'type': 'json',
                    'properties': {
                        'title': {'type': 'string'},
                        'sourceURL': {'type': 'string'},
                        'imageURL' : {'type': 'string'}
                    },
                    'required': ['title', 'sourceURL', 'imageURL']
                }
            }
            ) 
        return data   


    scraped_webs = links = asyncio.run(scrapper()).data


    ########## PRODUCT AGENT ##########

    products_message = f"""
    Eres un especialsita en recopilacion de datos de productos de tiendas online. Tu objetivo es a partir de una lista de paginas de productos de un sitio web en markdown sacar toda la informacion necesaria de cada uno de los productos de la lista. Estan como FireCralw Document

    Tu primer objetivo es descartar de las lista todas las paginas obsoletas o que vacias

    Tu segundo objetivo es sacar la informacion de cada uno de los productos para esto tendras que leer los datos de todas las paginas de productos que has flitrado previamente

    Que informacion sacaras?:
    1. Nombre del Producto
    2. Url del producto (es el sourceURL de la pagina)
    3. Link a la imagen del producto (estara en algun "og:image:, habra varios links, asegurate que sea el link correcto)
    4. Industria en la que se desarrolla el producto (Cosmetica, Salud, Telefonia, Suplementos, etc...)

    Lista de paginas : 
    {scraped_webs}

    La respuesta se usara para meter los datos en una base de datos asi que debe ser ÚNICAMENTE el siguiente objeto JSON, sin ningún texto antes o después, ni explicaciones, ni comentarios:

    {{
    "producto-1": {{
            "nombre-producto": "...",
            "url-producto": "...",
            "url-imagen" : "...",
            "industria" : "..."
            }}
    "producto-2": {{
            "nombre-producto": "...",
            "url-producto": "...",
            "url-imagen" : "...",
            "industria" : "..."
            }}
    ...
    }}


    El JSON devuelvelo sin saltos de linea, lo necescito asi

    """


    data = agent.invoke(products_message)['output']

    json_match = re.search(r'\{.*\}', data, re.DOTALL)
    if json_match:
        data = json_match.group(0)

    data = json.loads(data)

    return data
