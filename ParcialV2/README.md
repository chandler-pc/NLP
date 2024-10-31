# README - Modelos de Lenguaje con Bigramas, Backoff y Clustering

Este cuaderno de Python está orientado al análisis y creación de modelos de lenguaje usando técnicas como n-gramas, suavizado de Laplace, backoff, descuentos de Good-Turing, clustering de Brown, y embeddings como Word2Vec y GloVe. A continuación, se explican los diferentes ejercicios y técnicas implementadas en cada sección del cuaderno.

## Ejercicio 1: Modelos de Lenguaje y Suavizado

### Parte 1: Introducción a Modelos de Bigramas

Este ejercicio trabaja con un conjunto de frases para crear y analizar bigramas, y está dividido en varias subpartes:

- **Parte a:** Calculamos la probabilidad de los bigramas usando conteo simple. Primero se cuenta la frecuencia de unigramas y bigramas para luego calcular la probabilidad de los bigramas con base en los conteos.
- **Parte b:** Se implementa el suavizado de Laplace para los bigramas. Esto se hace para evitar las probabilidades cero en bigramas no observados y así asignar un valor mayor que cero a cada posible bigrama del vocabulario.
- **Parte c:** Observamos cómo afecta la probabilidad de los bigramas calculados usando distintos valores de suavizado.
- **Parte d:** Calculamos la probabilidad de los bigramas usando técnicas de "backoff" y "stupid backoff". La técnica de "backoff" asigna una probabilidad basada en unigramas si el bigrama no se encuentra, mientras que "stupid backoff" aplica un factor multiplicativo para ajustar la probabilidad.

### Parte 2: Descuento de Good-Turing

En esta sección se aplica el descuento de Good-Turing para ajustar las frecuencias de n-gramas y mejorar la estimación de la probabilidad de eventos raros.

- **Parte e:** Se calcula la frecuencia de frecuencias y se ajustan los conteos de los n-gramas según el método de Good-Turing, lo cual ayuda a obtener estimaciones más realistas para los bigramas poco frecuentes o no observados.

## Ejercicio 2: Selección y Preparación del Corpus

### Selección del Corpus

El corpus seleccionado para este ejercicio es el texto del *Quijote*. Se aplica tokenización, stemming (reducción de las palabras a su raíz) y se eliminan las stopwords para obtener una lista limpia de tokens que se utilizará para análisis posterior.

- **Tokenización y Filtrado:** Se implementa una función para tokenizar el corpus, aplicar stemming a cada palabra y eliminar stopwords. También se filtran los tokens que aparecen al menos cinco veces.

- **Unigramas y Bigramas:** Se obtienen los unigramas y bigramas del texto filtrado para su uso en las técnicas posteriores.

## Técnicas de Modelado del Lenguaje

### A. Clustering de Brown

Se implementa el algoritmo de clustering de Brown para agrupar palabras del corpus basado en sus similitudes en el contexto. El objetivo del clustering de Brown es agrupar las palabras en clusters de manera que se maximice la probabilidad conjunta de los bigramas dentro de cada cluster. Se define una función para inicializar los clusters y luego se busca el par óptimo de clusters para fusionar con base en una función de pérdida.

### B. Análisis Semántico Latente (Latent Semantic Analysis - LSA)

No implementado

### C. Word2Vec

Se implementan dos variantes del algoritmo Word2Vec: CBOW (Continuous Bag of Words) y Skip-gram.

- **CBOW:** El modelo CBOW predice la palabra objetivo a partir de las palabras del contexto. Se implementan funciones para realizar el paso forward y actualizar los embeddings mediante retropropagación.
- **Skip-gram:** En este caso, se predicen las palabras del contexto a partir de una palabra objetivo. Se entrena el modelo usando muestreo negativo para hacer el cálculo más eficiente.

### D. GloVe (Global Vectors for Word Representation)

Se implementa el modelo GloVe, el cual usa una matriz de coocurrencia para calcular los vectores de palabras. Los embeddings son ajustados mediante un costo ponderado, donde la función de peso depende del número de coocurrencias.

- **Matriz de Coocurrencia:** Se construye una matriz de coocurrencia para calcular los vectores de palabras y se optimiza usando la función de costo definida.
