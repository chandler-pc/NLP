#https://github.com/chandler-pc/NLP/blob/main/Prueba_Entrada.py

import re

tokens = {}
vocabulary = {}

#Function to add Token or increment Token frequency on tokens dictionary
def add_to_tokens(token):
    str_token = str(token)
    if str_token in tokens:
        tokens[str_token].frequency += 1
    else:
        tokens[str_token] = Token(str_token)

#Function to initialize the vocabulary with the characters
def fill_vocabulary(text):
    for c in text:
        if c.isalpha():
            if c in vocabulary:
                vocabulary[c] += 1
            else:
                vocabulary[c] = 1

#Class to represent the Token object
class Token:
    def __init__(self, word):
        self.word = word.strip() # remove whitespaces
        self.frequency = 1 # initializ frequency
        self.splits = [c for c in word.strip()] # split every character

    # Object representation
    def __repr__(self):
        return f'{self.word} - {self.frequency} - {self.splits}'
    
    # String representation
    def __str__(self):
        return f"{self.word}"
    
    # Get all pairs of characters
    def get_pairs(self):
        return [(self.splits[i], self.splits[i+1]) for i in range(len(self.splits) - 1)] 
    
    # Function to join a pair in the splits
    def add_pair(self, pair):
        if pair is None:
            return
        new_splits = []
        ignore_next = False
        for i in range(len(self.splits)-1):
            # check if the actual character has been joined
            if ignore_next:
                ignore_next = False
                continue
            # check if the actual character and the next are the most common pair
            if(pair[0] == self.splits[i] and pair[1] == self.splits[i+1]):
                pair_to_add = "".join(pair)
                new_splits.append(pair_to_add)
                ignore_next = True
                # add the most common pair to vocabulary or increment the frequency
                if pair_to_add not in vocabulary.keys():
                    vocabulary[pair_to_add] = 1
                else:
                    vocabulary[pair_to_add] += 1
            else:
                new_splits.append(self.splits[i])
        # if the last character has not been joined then add to the new_splits
        if not ignore_next:
            new_splits.append(self.splits[-1])
        self.splits = new_splits

# Function to tokenize the text
def tokenize(text):
    spliced_words = re.findall(r'(\s*\w+\s*)|(.|,|;)', text) # regex to separate words (spaces-alphanumeric-space)|(any of this punctuation)
    for word in spliced_words:
        add_to_tokens(Token(word[0]) if len(word[0]) > 0 else Token(word[1])) # add the spliced words to tokens dictionary
    #old logic *return [add_to_token((Token(token[0]))) if len(token[0])  > 0 else add_to_token(str(Token(token[1]))) for token in spliced_words]*

# BPE Algorithm
def byte_pair_encoding(number_of_repetitions):
    pairs = {}
    used_pairs = set()
    counter = 0
    # add all pairs of characters to pairs dictionary
    for token in tokens.values():
        for pair in token.get_pairs():
            if pair in pairs:
                pairs[pair] += 1
            else:
                pairs[pair] = 1
    # run number_of_repetitions times
    while counter < number_of_repetitions:
        most_common = None
        num_most_common = 0
        # check the most common pair
        for pair, frequency in pairs.items():
            if frequency > num_most_common and pair not in used_pairs:
                num_most_common = frequency
                most_common = pair
        # add the pair to join two characters on every token
        for token in tokens.values():
            token.add_pair(most_common)
        # add the last pair to used_pairs
        used_pairs.add(most_common)
        counter += 1

# Function to find the edit distance with recursion
def editDist(s1,s2):
    def editDistRec(s1,s2,m,n):
        # if the first string is empty then return the diference length of the another string
        if m == 0:
            return n
        # if the second string is empty then return the diference length of the another string
        if n == 0:
            return m
        # if the last character of the string is the same, then ignore and continue
        if s1[m-1] == s2[n-1]:
            return editDistRec(s1,s2, m-1, n-1)
        # check for the minimun distance for insertion, edition and elimination for
        return 1 + min(editDistRec(s1,s2,m,n-1),editDistRec(s1,s2,m-1,n),editDistRec(s1,s2,m-1,n-1))
    return editDistRec(s1,s2,len(s1),len(s2))


text = "London is the capital and most populous city of England and the United Kingdom."

fill_vocabulary(text) # initialize the vocabulary

tokenize(text) # tokenize the words of the text
byte_pair_encoding(10) # use the BPE algorithm with 10 iterations
print(vocabulary) # print the final vocabulary
for token in tokens.values():
    print(token.splits) # print the last split of the token

print(editDist("London", "Londinium")) # check the edit distance

# References
# https://towardsdatascience.com/byte-pair-encoding-subword-based-tokenization-algorithm-77828a70bee0
# https://huggingface.co/learn/nlp-course/en/chapter6/5
# https://www.geeksforgeeks.org/byte-pair-encoding-bpe-in-nlp/
# https://www.geeksforgeeks.org/edit-distance-dp-5/