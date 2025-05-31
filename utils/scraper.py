from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate, SystemMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.agents import load_tools, initialize_agent, AgentType, create_react_agent, AgentExecutor
from langchain.memory import ConversationBufferMemory
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

import re
import json
# import os
# from dotenv import load_dotenv

## LANGCHAIN LLM SCRAPER AGENT

API_KEY = 'AIzaSyDVIGZFOX0lAdFp5JKUmhzCkiC07ymfrcI'
SERP_API_KEY = '9a522417f7a8d38e7fb19a4be4302a36d2c40dc586e295389efb94a5a948adff'


llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=API_KEY, temperature=0)
memory = ConversationBufferMemory(memory_key='chat_history')
tools = load_tools(['serpapi','llm-math'], llm=llm, serpapi_api_key=SERP_API_KEY)
agent = initialize_agent(tools=tools,llm=llm, agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION, memory=memory,verbose=True)


url = 'https://milfshakes.es/products/soccer-jeans'

system_message_text = f"""
Eres un especialsita en recopilacion de datos de productos de tiendas online. Tu objetivo es a partir de una url de un producto, sacar toda la informacion necesaria.

Que informacion sacaras?:
1. Nombre del Producto
2. Marca del Producto
3. Nombre de la tienda que lo vende (aunque no necesariamente pero puede coincidir con la Marca del producto)
4. Industria en la que se desarrolla el producto (Cosmetica, Salud, Telefonia, Suplementos, etc...)
5. Resumen de la politica de camibios y devoluciones de la tienda (es probable que sea necesario entrar en otros destinos del sitio web) 

URL : 
{url}

La respuesta se usara para meter los datos en una base de datos asi que debe ser ÚNICAMENTE el siguiente objeto JSON, sin ningún texto antes o después, ni explicaciones, ni comentarios. NO uses markdown, ni comillas triples, ni ningún texto antes o después. SOLO el objeto JSON.:
{{
"nombre": "...",
"marca": "...",
"tienda": "...",
"industria" : "...",
"politicas" : "..."
}}

NO uses markdown, ni comillas triples, ni ningún texto antes o después. SOLO el objeto JSON.
"""


data = agent.invoke(system_message_text)['output']

json_match = re.search(r'\{.*\}', data, re.DOTALL)
if json_match:
    data = json_match.group(0)

data = json.loads(data)

print(data)