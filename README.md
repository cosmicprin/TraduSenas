# Plantilla Avance Preliminar del Proyecto

## 1. Información del Proyecto
- **Nombre del Proyecto:** TraduSeñas
- **Equipo:** Abigail Mora, Melina Soto, Josué Morales, Walky Hernández.
- **Roles:** - 

## 2. Descripción y Justificación
- **Problema que se aborda:**
  El aprendizaje de LESCO en entornos educativos es limitado por la falta de recursos interactivos. TraduSeñas aborda esta necesidad ofreciendo una herramienta tecnológica que facilita la enseñanza y práctica del alfabeto LESCO.
- **Importancia y contexto:**
  La Lengua de Señas Costarricense es el medio de comunicación principal de las personas con capacidad auditiva reducida, sin embargo, su enseñanza formal y aprendizaje autodidacta son poco accesibles. TraduSeñas representa una herramienta innovadora para el aprendizaje del alfabeto LESCO, permitiendo que estudiantes, docentes y cualquier persona interesada puedan interactuar con la lengua de señas de forma accesible y tecnológica, al fomentar la inclusión educativa, el proyecto contribuye a una sociedad más consciente de la diversidad comunicativa.
- **Usuarios/beneficiarios:**
  Bibliotecas, universidades, escuelas de educación especial y hogares con personas sordas o estudiantes de la lengua.

## 3. Objetivos del Proyecto
- **Objetivo General:**
  Promover el aprendizaje del alfabeto de la Lengua de Señas Costarricense (LESCO), facilitando la inclusión educativa mediante un sistema accesible que interpreta letras dactilológicas a texto utilizando sensores, microcontrolador y procesamiento digital.
- **Objetivos Específicos:**
  Diseñar e implementar un guante sensorizado capaz de detectar movimientos correspondientes a las letras del alfabeto LESCO.
  Programar un microcontrolador que procese las señales de los sensores y las traduzca en datos legibles.
  Desarrollar una aplicación móvil conectada a una API que reciba, interprete y visualice las letras detectadas en tiempo real.

## 4. Requisitos Iniciales
- Lista breve de lo que el sistema debe lograr:  
  - Requisito 1
    Detectar correctamente las letras del alfabeto LESCO mediante sensores integrados en el guante.
  - Requisito 2
    Procesar y traducir las señales del guante a texto legible mediante el microcontrolador.
  - Requisito 3
    Visualizar el resultado de la traducción en una aplicación móvil conectada al sistema.

## 5. Diseño Preliminar del Sistema
- **Arquitectura inicial (diagrama):**
   
  ![WhatsApp Image 2025-08-02 at 11 06 43](https://github.com/user-attachments/assets/ae671022-2f4b-4716-9184-d66ed2bdfa96)

- **Componentes previstos:**  
  - Microcontrolador: ESP32/IdeaBoard
  - Sensores/actuadores: Sensores de Flexión 
  - LLM/API: API local para conversión de señas a texto (sin uso de LLM actualmente).
  - Librerías y herramientas:
  
    Librería: IdeaBoard
    Módulos: socketpool, ssl, wifi
    Librería: adafruit_requests
    Módulos: json, time, board
    IDE: Visual Studio Code, Thonny


- **Bocetos o esquemas:**  
  *(Agregar imágenes o diagramas si es posible)*  

## 6. Plan de Trabajo
- **Cronograma preliminar:**  
  *(Breve tabla con hitos importantes y fechas estimadas)*  

- **Riesgos identificados y mitigaciones:**  
  - Riesgo 1: Mitigación  
  - Riesgo 2: Mitigación  

## 7. Prototipos conceptuales (si aplica)
- **Código mínimo de prueba:**  
  *(Por ejemplo: conexión inicial con el microcontrolador o consulta al LLM)*  

- **Evidencia visual:**  
  *(Capturas de pantalla, esquemas, fotos del prototipo, etc.)*

---
> **Nota:** Este avance busca documentar el pensamiento del equipo en las fases iniciales del proyecto. No es necesario que el sistema esté funcionando aún, o que absolutamente todos los puntos de esta plantilla estén copletos

