from ngram import NgramModelWithBackoff
import pickle
import string
import os

corpus = [] # Open American National Corpus
for textfile in os.listdir('./corpus'):
    with open(f'./corpus/{textfile}', 'r', encoding="utf8") as file:
        file = file.read().replace("\n", " ")
        for i in string.punctuation:
            file = file.replace(i, " ")
        corpus.append(file.strip().lower())

ngram_model_backoff = NgramModelWithBackoff(5, corpus)

with open('ngram_model_backoff.pkl', 'wb') as file:
    pickle.dump(ngram_model_backoff, file)

print("Modelo guardado en ngram_model_backoff.pkl")

