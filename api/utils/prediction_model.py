from langchain.agents import initialize_agent, Tool, load_tools
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.tools import BaseTool
from langchain.memory import ConversationBufferMemory
from langchain_community.document_loaders import CSVLoader
from langchain_community.vectorstores import Chroma
import pandas as pd
import fitz

import re
import json
import os
from dotenv import load_dotenv


dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

API_KEY = os.getenv("GOOGLE_API_KEY")
FIRECRAWL_KEY = os.getenv("FIRECRAWL_API_KEY")
# SERP_API_KEY = os.getenv('SERP_API_KEY')




########## CSV FORMAT ##########

loader = CSVLoader(file_path='data/processed/openlca_results_recorrected_calcsetup_ELCD.csv')
documents = loader.load()

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001") # Use an appropriate embedding model

vectorstore = Chroma.from_documents(documents, embeddings)

retriever = vectorstore.as_retriever()



########## AGENT TOOLS ##########

class CSV_query(BaseTool):
    name : str = "csv_query"
    description : str = "Useful for answering questions about the data in the CSV.Input should be a question or keywords related to the CSV content.Returns relevant information from the CSV."

    def _run(self, query: str):
        relevant_docs = retriever.invoke(query)
        # You might want to format the docs nicely or summarize them here
        return "\n".join([doc.page_content for doc in relevant_docs])
    

class LeerPDFTool(BaseTool):
    name : str = "leer_pdf"
    description : str = "Lee información de un PDF sobre un producto"

    def _run(self, file_path: str):
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    


# # Tool para consultar CSVs con factores de emisión
# class ConsultarCSVTool(BaseTool):
#     name : str = "consultar_csv"
#     description : str = "Consulta factores de emisión en archivos CSV"

#     def _run(self, query: str):
#         procesos = pd.read_csv("data/processed/openlca_results_recorrected_calcsetup_ELCD.csv")   #### DEFINIR BIEN LOS CSVs ####
#         return {
#             "procesos": procesos.to_dict(orient='records'),
#         }
    
 

# class CalculadoraEmisionesTool(BaseTool):
#     name : str = "calcular_emisiones"
#     description : str = "Calcula las emisiones estimadas usando datos del producto"

#     def _run(self, info_producto: str):
#         return "Emisión estimada: 3.4 kg CO₂e"
    

created_tools = [
    LeerPDFTool(),
    CSV_query(),
    # ConsultarCSVTool(),
    # CalculadoraEmisionesTool()
]


async def prediction():

    ########## AGENT ##########

    llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-lite", google_api_key=API_KEY, temperature=0)
    tools = load_tools(['llm-math'], llm=llm)


    agent = initialize_agent(
        tools + created_tools,
        llm,
        agent_type="zero-shot-react-description",
        memory=ConversationBufferMemory(memory_key="chat_history"),
        verbose=True,
    )

    FILE = 'temp-files/temp.pdf'
    from data.resumen_muestra import resumen as RESUMEN_GENERAL

    agent_prompt = f"""
    Eres un analista de productos especializado en calcular la huella de carbono de un producto, tu objetivo es utilizar los datos de un archivo pdf de un producto y calcular cual es su huella estimada.

    Tendras que:
    1. Clacular la huella de carbono de cada uno de los procesos [Materias Primas, Fabricacion, Packaging, Transporte, Uso, Fin de Vida]. Para esto vas a hacer uso de la herramienta "csv_query"
    2. Calcular la huella de carbono total haciendo una suma de todos los procesos
    3. Estimar la media de la industria y productos similares y calcualren porcientos la diferencia de este producto en relacion a la media (si esta por debajo -x%, si esta por encima x%)
    4. Resumen general de las conclusiones sacadas del proceso imitando el formato que te doy. EL resumen debe ser en ingles

    Resumen: {RESUMEN_GENERAL}

    Para esto consultaras el CSV que tienes como herramienta donde tienes una lista de procesos y su emision de carbono. Compararas los procesos del producto y estimaras la emision de cada proceso.
    Al final calcularas el total de emision de CO2 del producto
    Esta bien que hagas asunciones si ves que te faltan datos, intenta que estas asunciones sean lo mas precisas posibles
    PDF: {FILE}

    La respuesta se usara para meter los datos en una base de datos asi que debe ser ÚNICAMENTE el siguiente objeto JSON, sin ningún texto antes o después, ni explicaciones, ni comentarios:

        {{
        "output": {{
                "emision_materia_prima": "...",
                "emision_fabricacion": "...",
                "emision_packaging" : "...",
                "emision_transporte" : "...",
                "emision_uso" : "...",
                "emision_fin_de_vida" : "...",
                "emision_total" : "...",
                "diferencia_porcentual" : "...",
                "resumen_general": "..."
                }}

        }}


    El JSON devuelvelo sin saltos de linea, lo necescito asi

    """

    data = agent.invoke(agent_prompt)['output']

    return data 
