import nltk
# nltk.download('words')
from nltk.tokenize import regexp_tokenize
from nltk.corpus import words

def tokenize_text(input_text):
    pattern = r'\w+|\$[\d\.]+'

    words = input_text.lower()
    words = regexp_tokenize(words, pattern)
    return words

def levenshtein_distance(word1, word2):
    dp = [[0 for _ in range(len(word2) + 1)] for _ in range(len(word1) + 1)]

    for i in range(len(word1) + 1):
        dp[i][0] = i
    for j in range(len(word2) + 1):
        dp[0][j] = j

    for i in range(1, len(word1) + 1):
        for j in range(1, len(word2) + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1
    return dp[len(word1)][len(word2)]


def get_suggestions(word, dictionary, num_suggestions=5, length_threshold=2):
    # Filtrar palabras con longitud dentro de un rango de ± length_threshold
    filtered_words = [dict_word for dict_word in dictionary if abs(len(dict_word) - len(word)) <= length_threshold]
    
    # Calcula la distancia de Levenshtein solo para las palabras filtradas
    distances = [(dict_word, levenshtein_distance(word, dict_word)) for dict_word in filtered_words]
    
    # Ordena las palabras primero por la menor distancia, luego alfabéticamente
    distances.sort(key=lambda x: (x[1], x[0]))
    
    # Retorna las primeras 'num_suggestions' palabras con la menor distancia
    return [word for word, _ in distances[:num_suggestions]]


def correct_spelling(input_text, dictionary):
    words = tokenize_text(input_text)
    corrected_words = []
    for word in words:
        if word not in dictionary:
            suggestions = get_suggestions(word, dictionary,15)
            print(f"Sugerencias para '{word}': {suggestions}")
            corrected_words.append(suggestions[0])
        else:
            corrected_words.append(word)
    return corrected_words

dictionary = {word.lower() for word in words.words()}
dictionary = list(dictionary)
# Ordena la lista de palabras por longitud
dictionary.sort(key=len)

if __name__ == "__main__":
# Carga el diccionario y conviértelo en una lista
    print(get_suggestions("chandler", dictionary))
    if 'Komi' in dictionary:
        print("'se' está en el diccionario")
    else:
        print("'se' NO está en el diccionario")
# word = "house"

# suggestion = get_suggestions(word, dictionary,20)

# test = "Today I went to UNI to se my clasmates"

# correct_spelling(test,dictionary)


