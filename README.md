# Desafío Devera

Este proyecto es la solución al reto planteado por **Devera** dentro del **Desafío de Tripulaciones** (Full Stack 03/2025). El objetivo principal es construir una **aplicación web** que permita a los clientes de Devera llevar todo el recorrido: desde el **onboarding inteligente** (subida de productos, archivos e información) hasta la **visualización de informes detallados** del impacto ambiental y emision de CO2 por producto. 

---

## Índice

1. [Descripción del Proyecto](#descripción-del-proyecto)  
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)  
3. [Arquitectura General](#arquitectura-general)  
4. [Flujo de Usuario](#flujo-de-usuario)  
5. [Estructura del Repositorio](#estructura-del-repositorio)  
6. [Instalación y Configuración](#instalación-y-configuración)  
   - [Prerequisitos](#prerequisitos)  
   - [Backend](#backend)  
   - [Frontend](#frontend)  
   - [Variables de Entorno](#variables-de-entorno)  
   - [Base de Datos](#base-de-datos)  
7. [Uso y Endpoints Principales](#uso-y-endpoints-principales)  
   - [Autenticación](#autenticación)  
   - [Onboarding](#onboarding)  
   - [Productos](#productos)  
   - [Archivos](#archivos)  
---

## Descripción del Proyecto

Devera busca que cualquier marca, sin importar su tamaño, pueda **medir**, **comparar** y **comunicar** el impacto ambiental de sus productos de forma sencilla. Para ello, automatiza el Análisis de Ciclo de Vida (ACV) mediante IA y necesita una interfaz web amigable donde los usuarios:

1. Suban la información de sus productos (Onboarding Inteligente).  
2. Visualicen la lista de productos analizados con métricas como Huella de Carbono, Impact Score, Estado, etc.  
3. Accedan al **detalle completo de cada producto**, con gráficas, conclusiones y opciones de descarga de informe.  
4. Gestionen archivos asociados a cada producto (PDF, imágenes, CSV, etc.).  
5. Se autentiquen de manera segura antes de acceder al dashboard (login/logout, renovación de tokens).  

Este repositorio contiene:

- **Backend**: API REST en **Node.js** con **Express**, persiste datos en **PostgreSQL**.  
- **Frontend**: Aplicación **React** (Vite) como SPA, con rutas protegidas, gestión de estado mediante Context API y estilos en SCSS.  
- **Onboarding**: Wizard paso a paso que “scrapea” la página web del cliente, muestra productos, permite adjuntar archivos e información adicional.  
- **Dashboard**: Tabla de productos con funcionalidades de búsqueda, ordenamiento, exportación (CSV), y botones para ver detalle, descargar, ver archivos.  
- **Detalle de Producto**: Página modular con secciones (Resumen, Conclusiones, Desglose de Categorías, Gráficas, Sostenibilidad de la Marca, Marketing) y gestión de archivos (subir/descargar).  

---

## Tecnologías Utilizadas

### Frontend
- **React** (v18+)  
- **Vite** (bundler rápido, hot-reload)  
- **React Router v6** (rutas & navegación)  
- **Context API** (gestión de estado global para búsquedas)  
- **SCSS** (preprocesador CSS modular)  
- **Lucide-React** (iconos SVG en componentes)  
- **axios / fetch API** para llamadas HTTP a la API  

### Backend
- **Node.js** (v18+)  
- **Express.js**  
- **multer** (gestión de archivos multipart/form-data)  
- **pg / pg-promise** (cliente para **PostgreSQL**)  
- **dotenv** (carga de variables de entorno)  
- **bcrypt** (hashing de contraseñas)  
- **jsonwebtoken** (JWT para autenticación y renovación de tokens)  
- **cors** (configuración de CORS)  
- **Helmet** (prácticas de seguridad HTTP)  
- **nodemon** (desarrollo local con recarga automática)   

---

## Flujo de Usuario

A continuación se describen los principales pasos que vivirá un usuario en la aplicación:

1. **Registro / Login**  
   - El usuario recibe invitación por email (fuera del alcance de este repositorio).  
   - Accede a la ruta `/login` e ingresa email + contraseña.  
   - Si es válido, el backend emite un **JWT** que se guarda en `localStorage` (`authToken`).  
   - El frontend detecta el token y redirige automáticamente al flujo de **Onboarding** o al **Dashboard** si ya completó el Onboarding.  

2. **Onboarding Inteligente**  
   - El primer inicio lleva al usuario a la ruta `/onboarding`.  
   - Se despliega **Header + Botón “Ir al Dashboard →”** (para saltear si ya hizo onboarding).  
   - **Paso 1**: Formulario con URL de la web y nombre de la empresa.  
   - **Paso 2**: (Simulado) “Agente IA” obtiene productos del sitio web. Se muestran en lista con checkboxes.  
     - El usuario selecciona cuáles productos quiere analizar.  
     - Opcionalmente adjunta archivos PDF/CSV (un archivo por producto) para enriquecer la información.  
   - **Paso 3**: Ingreso de porcentaje de ventas por país (Tally embed o input manual).  
   - **Paso 4**: Confirmación final y “Finalizar Onboarding”.  
   - Al finalizar, el backend recibe la data seleccionada + archivos, guarda en BD y redirige a `/dashboard`.  

3. **Dashboard de Productos**  
   - Ruta protegida `/` ó `/dashboard`: muestra la lista de productos importados en tabla.  
   - Funcionalidades de la tabla:  
     - **Búsqueda** (filtrado por nombre).  
     - **Ordenamiento** (huella de carbono, score, estado, etc.).  
     - **Exportar listado** en CSV (frontend genera un blob `text/csv`).  
     - **Ver detalle** (click en ícono “ojo” redirige a `/product/:id`).  
     - **Descargar reporte** (botón en cada fila dispara `window.open("/api/files/<file_id>")`).  
     - **Archivos** (botón carpeta abre modal lista de archivos o redirige a pestaña Archivos generales).  

4. **Detalle de Producto**  
   - Ruta `/product/:id`: Muestra:  
     - **Imagen del producto**, nombre, puntaje (A/B/C), impact score (barra de progreso).  
     - Botones:  
       - Ver reporte (visualización en modal o PDF embed).  
       - Descargar reporte (descarga de PDF estático o generado dinámicamente).  
       - Adjuntar archivo adicional (campo file input).  
     - **Secciones informativas**:  
       - **Resumen**: Huella de carbono total + desglose (materia prima, fabricación, transporte, empaquetado, uso, fin de vida).  
       - **Comparativa**: % vs benchmark, gráficas de barras circulares.  
       - **Conclusiones**, **Detalle de categorías**, **Sostenibilidad de la marca**, **Información marketing**.  
     - Lista de **archivos adjuntos**: nombre, tamaño, botón de descarga. Se obtienen desde la tabla `files` filtrando `product_id = :id`.  

5. **Archivos Generales**  
   - Ruta `/files` (opcional según requerimientos):  
     - Muestra todos los archivos subidos por el usuario (independientemente del producto).  
     - Permite descargarlos individualmente o descargar todos en un ZIP (implementación pendiente/botón no funcional).  
     - Botón “+ Añadir más archivos” abre file input y agrega a una lista temporal en memoria (no hay persistencia si recarga).  

6. **Cierre de Sesión**  
   - El usuario pulsa “Cerrar Sesión” en el header. El token se elimina de `localStorage` y se redirige a `/login`.  
   - Al caducar el token, el frontend detecta (401) y fuerza logout.  