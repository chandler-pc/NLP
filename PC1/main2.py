import nltk
nltk.download('words')
from nltk.corpus import words
dictionary = set(words.words())


from nltk import ngrams
from collections import Counter

def train_ngram_model(corpus):
    tokens = nltk.word_tokenize(corpus.lower())
    bigrams = list(ngrams(tokens, 2))
    bigram_model = Counter(bigrams)
    return bigram_model

def score_sequence(sequence, ngram_model):
    bigrams = list(ngrams(sequence, 2))
    score = sum([ngram_model[bigram] for bigram in bigrams])
    return score
