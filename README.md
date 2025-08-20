# TraduSeñas: Guante Traductor de LESCO
Documentación del proyecto "TraduSeñas". Esta iniciativa busca crear una herramienta tecnológica que facilite la enseñanza y práctica del alfabeto de la Lengua de Señas Costarricense (LESCO) a través de un prototipo funcional e interactivo.

---
## ¿Qué es TraduSeñas?
TraduSeñas es un sistema que aborda la falta de recursos interactivos para el aprendizaje de LESCO. Consiste en un guante equipado con sensores de flexión que detectan los gestos del alfabeto dactilológico. El objetivo principal es ofrecer un puente de comunicación y una herramienta de aprendizaje innovadora para estudiantes, docentes y cualquier persona interesada en la lengua de señas.

El guante utiliza un microcontrolador ESP32 (IdeaBoard) para leer los datos de los sensores. En lugar de procesar las señas en el propio dispositivo, el sistema envía los datos a través de WiFi a una API local. Esta API interpreta los valores de los sensores y los traduce a la letra correspondiente. Finalmente, una aplicación móvil muestra el resultado en tiempo real, fomentando la inclusión y una sociedad más consciente de la diversidad comunicativa.

Los beneficiarios clave de este proyecto son:
* Bibliotecas y centros educativos.
* Universidades y escuelas de educación especial.
* Hogares con personas sordas o estudiantes de LESCO.

Este prototipo cuenta con las funcionalidades básicas de: Lectura de sensores, normalización de datos y comunicación vía WiFi con una API para la interpretación de las señas.

---
## Índice de Contenido
1.  [Organización del Repositorio](#organización-del-repositorio)
2.  [Materiales Electrónicos](#materiales-electrónicos)
3.  [Montaje y Conexiones](#montaje-y-conexiones)
4.  [Código y Librerías Empleadas](#código-y-librerías-empleadas)
5.  [Uso y Pruebas](#uso-y-pruebas)
6.  [Problemas Detectados y Mejoras a Futuro](#problemas-detectados-y-mejoras-a-futuro)
7.  [Participantes](#participantes)
8.  [Licencia](#licencia)

---
## Organización del Repositorio
* Código Guante: Contiene el código en Python (main.py) que se ejecuta en el microcontrolador ESP32 / IdeaBoard.
* API Backend: Incluye el código de la API local responsable de recibir los datos y reconocer la letra.
* Documentación: Contiene imágenes, diagramas de arquitectura, bocetos y otros recursos visuales del proyecto.

---
## Materiales Electrónicos
* Microcontrolador: ESP32 / IdeaBoard.
* Sensores: 5 Sensores de Flexión.
* Protoboard y Resistencias (ej. 10kΩ para divisores de voltaje).
* Cables de conexión (Jumpers).
* Un guante en impresión 3D.

---
## Montaje y Conexiones
El proceso de creación implica el montaje de los sensores en el guante y la conexión del circuito al microcontrolador.


1.  Montaje Físico: Se fijan los cinco sensores de flexión en el guante, asegurando que puedan doblarse libremente con los dedos.
    
    ![WhatsApp Image 2025-08-20 at 08 53 41](https://github.com/user-attachments/assets/b6251138-a639-4f01-9ecc-2f2870ba41eb)
    
2.  Circuito Electrónico: Los sensores se conectan a los pines analógicos del ESP32/IdeaBoard. Según el código de prueba, las conexiones son:
    * Sensor Pulgar: IO33
    * Sensor Índice: IO32
    * Sensor Medio: IO35
    * Sensor Anular: IO34
    * Sensor Meñique: IO39
    
---
## Código y Librerías Empleadas

### Librerías y Herramientas (CircuitPython)
* IdeaBoard: Librería específica para interactuar con los pines de la placa IdeaBoard de forma sencilla.
* wifi, socketpool, ssl: Módulos para gestionar la conexión de red WiFi de manera segura.
* adafruit_requests: Facilita la realización de peticiones HTTP (POST en este caso) a la API.
* json, time, board: Módulos estándar para manejar formato de datos, pausas y configuración de pines.
* IDEs: Visual Studio Code, Thonny.

### Arquitectura y Lógica del Código
La arquitectura del sistema se basa en un modelo cliente-servidor:
1.  Cliente (Guante - ESP32): El código principal se ejecuta en un bucle. En cada iteración, lee los valores de los 5 sensores de flexión.
2.  Normalización: Los valores crudos (0-4095) son normalizados a un rango de 0.1 a 1.0. Esto estandariza los datos antes de enviarlos.
3.  Envío de Datos: Los datos normalizados se empaquetan en un formato JSON {"sensores": [val1, val2, ...]}.
4.  Petición HTTP: Se realiza una petición POST a la URL de la API local (http://192.168.1.23:5000/reconocer_letra), enviando el JSON.
5.  Servidor (API): La API recibe los datos, los procesa con su lógica interna para reconocer la letra y devuelve una respuesta (ej. {"letra": "A"}).
6.  Respuesta: El ESP32 recibe e imprime la respuesta de la API en la consola.

---
## Uso y Pruebas
1.  Levantar el Servidor: Ejecutar el script de la API en el ordenador para que esté escuchando peticiones en la IP y puerto configurados.
2.  Cargar el Código: Flashear el código de CircuitPython en la placa ESP32 / IdeaBoard.
3.  Conexión: El guante se conectará automáticamente a la red WiFi especificada.
4.  Pruebas: Abrir la consola serial (REPL) del dispositivo. Realizar las señas con el guante y observar en la consola tanto los valores enviados como la respuesta recibida de la API.

---
## Problemas Detectados y Mejoras a Futuro
* Riesgos Actuales: 
    * Dependencia de una fuente de poder externa (laptop). Mitigación: Usar una batería o power bank compatible.
    
* Mejoras a Futuro:
    * Desarrollar la Lógica de la API: Implementar un sistema robusto (con reglas o Machine Learning) para traducir los datos de los sensores a letras de forma precisa.
    
    * Ampliar el Vocabulario: Expandir el sistema para que reconozca todo el alfabeto y, eventualmente, palabras y oraciones completas.
    * Portabilidad: Integrar una batería para que el sistema sea completamente inalámbrico y portátil.

---
## Participantes
* Abigail Mora
* Melina Soto
* Josué Morales
* Walky Hernández

---
## Licencia
Este proyecto está licenciado bajo los términos de la Licencia MIT.

---
## Galería
En este apartardo encontrará imagenes que hemos recopilado a lo largo de todo el proyecto.

- **Arquitectura inicial (diagrama):**
  
  ![WhatsApp Image 2025-08-02 at 11 06 43](https://github.com/user-attachments/assets/ae671022-2f4b-4716-9184-d66ed2bdfa96)
  
- **Bocetos o esquemas:**
  
  ![435d46ff-e6c8-487b-b2b1-e61f61e1161c](https://github.com/user-attachments/assets/79891ffc-639a-4970-b803-70fa446ac21d)

- **Prototipo:**

  ![b3ac9493-ec70-4a6f-8304-23559420acfc](https://github.com/user-attachments/assets/c890a717-d68e-4b95-8094-4a86f8e209f0)
