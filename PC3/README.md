# Embeddings hiperbólicos en redes neuronales recurrentes para representaciones jerárquicas

### Instalación de dependencias
Geoopt es una biblioteca de PyTorch para optimizaciones y operaciones en geometrías no euclidianas.

```python
!pip install geoopt
```

### Descarga de recursos de NLTK
Usaremos un corpus provisto por NLTK el cual es Treebank. Treebank contiene datos de anotaciones gramaticales que se usarán para entrenamiento del modelo.

```python
import nltk
nltk.download('treebank')
```

### Importación de librerías
Usaremos librerías  como `torch` y `geoopt`, además de nltk para el procesamiento del corpus Treebank.  
También definimos `extract_sequences()`, que convierte un árbol de sintaxis en secuencias de tokens para su entrenamiento.

```python
import torch
import torch.nn as nn
import geoopt
from nltk.corpus import treebank
from nltk.tree import Tree
from collections import Counter

def extract_sequences(tree):
    words = tree.leaves()
    labels = []

    def traverse(t):
        if isinstance(t, Tree):
            if len(t) == 1 and isinstance(t[0], str):
                labels.append(t.label())
            else:
                for child in t:
                    traverse(child)

    traverse(tree)
    return words, labels
```

### Definición de la clase del modelo
Creamos la clase `HyperbolicRNN`, una red neuronal basada en PyTorch que usa un embedding hiperbólico para representar secuencias de palabras.

```python
class HyperbolicEmbedding(nn.Module):
    def __init__(self, vocab_size, embedding_dim, curvature):
        super(HyperbolicEmbedding, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        self.manifold = geoopt.PoincareBall(c=curvature)

    def forward(self, x):
        euclidean_embeddings = self.embedding(x)
        hyperbolic_embeddings = self.manifold.expmap0(euclidean_embeddings)
        return hyperbolic_embeddings

class HyperbolicRNN(nn.Module):
    def __init__(self, vocab_size, embedding_dim, hidden_dim, output_dim, curvature=1.0):
        super(HyperbolicRNN, self).__init__()
        self.hyperbolic_embedding = HyperbolicEmbedding(vocab_size, embedding_dim, curvature)
        self.rnn = nn.RNN(embedding_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)

    def forward(self, x):
        embedded = self.hyperbolic_embedding(x)
        rnn_out, hidden = self.rnn(embedded)
        output = self.fc(rnn_out)
        return output
```

### Entrenamiento del modelo

```python
epochs = 50
for epoch in range(epochs):
    model.train()
    total_loss = 0
    for input_seq, target_seq in train_data:
        optimizer.zero_grad()
        output = model(input_seq.unsqueeze(0))
        loss = criterion(output.view(-1, label_vocab_size), target_seq.view(-1))
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    print(f"Epoch {epoch+1}/{epochs}, Loss: {total_loss:.4f}")
```

### Evaluación

```python
def evaluate(model, input_seq):
    model.eval()
    with torch.no_grad():
        output = model(input_seq.unsqueeze(0))
        predicted = output.argmax(dim=-1)
    return predicted
```

### Links
* https://www.ling.upenn.edu/courses/Fall_2003/ling001/penn_treebank_pos.html
* https://arxiv.org/pdf/1805.09112
* https://arxiv.org/pdf/1705.08039

