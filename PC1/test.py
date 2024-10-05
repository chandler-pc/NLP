import pickle
from ngram import NgramModelWithBackoff
from levenshtein import get_suggestions, dictionary


def get_prob_suggestion(context, suggestions, ngram_model):
    max_prob = -1
    best_suggestion = None
    for suggestion in suggestions:
        sequence = context + [suggestion]
        prob = ngram_model.calculate_probability(sequence)
        prob = round(prob, 5)
        print(f"Probabilidad de '{suggestion}': {prob}")
        if prob > max_prob:
            max_prob = prob
            best_suggestion = suggestion

    return best_suggestion
        

with open('ngram_model_backoff.pkl', 'rb') as file:
    ngram_model_backoff = pickle.load(file)

text = 'oscar are going to the besch'
text = text.lower().strip()
words = text.split()

for i, word in enumerate(words):
    if word not in dictionary:
        suggestions = get_suggestions(word, dictionary, 15)
        #print("sug",suggestions)
        if suggestions:
            context = words[:i]
            if len(context) > ngram_model_backoff.n - 1:
                context = context[-(ngram_model_backoff.n - 1):]
            best_suggestion = get_prob_suggestion(context, suggestions, ngram_model_backoff)
            print(f"Corrección sugerida para '{word}': {best_suggestion}")
        else:
            print(f"No se encontraron sugerencias para '{word}'")
    else:
        print(f"La palabra '{word}' está en el diccionario")