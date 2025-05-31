from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate, SystemMessagePromptTemplate, ChatPromptTemplate, HumanMessagePromptTemplate
from langchain.agents import load_tools, initialize_agent, AgentType, create_react_agent, AgentExecutor
from langchain.memory import ConversationBufferMemory
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

import re
import json
# import os
# from dotenv import load_dotenv


API_KEY = 'AIzaSyDVIGZFOX0lAdFp5JKUmhzCkiC07ymfrcI'


llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=API_KEY, temperature=0)
memory = ConversationBufferMemory(memory_key='chat_history')
agent = initialize_agent(tools=[],llm=llm, agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION, memory=memory, verbose=True)

url = 'https://saigucosmetics.com/products/base-de-maquillaje-fluida?variant=47539075973451'
lang = 'Español'


system_message = f"""
Eres un experto en huella de carbono de productos. Tu tarea es calcular que huella deja el producto que yo te pase a traves de una url.
Calcularas esa huella teniendo en cuenta el camino "Cradle to Grave" del producto. (Desde la obtencion de recursos y materias hasta el uso y descho del producto)
Tu informacion debe ser veridica, incluso deberas explicar en un paso a paso resumido como obtuviste el resultado.
En el caso de que te falte informacion, deberas hacer una busqueda exhuastiva en la web. Solo en el caso de no encontrar nada mas, puedes obviar el dato, aun asi lo quiero en el resumen.
Tus respuestas TODAS seran en {lang}
URL:
{url}
"""

memory.clear()
memory.chat_memory.add_message(SystemMessage(system_message))

result = agent.invoke('Hola, mi nombre es Daniel, pasame los datos de la url')['output']


