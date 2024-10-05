class NgramModelWithBackoff:
    def __init__(self, n: int, corpus: list):
        self.n = n
        self.corpus = corpus
        self.ngram_counts = {}
        for i in range(1,n+1):
            self.ngram_counts[i] = {}
        self._train()

    def _train(self):
        x = 0
        for sentence in self.corpus:
            sentence = sentence.split(" ")
            print(x)
            for i in range(1,self.n+1):
                for j in range(len(sentence)-(i-1)):
                    ngram = " ".join([sentence[k] for k in range(j,j+i)])
                    self._add_to_ngram(i,ngram)
            x+=1
        #print(self.ngram_counts)

    def _add_to_ngram(self, n: int, words: str):
        if words not in self.ngram_counts[n]:
            self.ngram_counts[n][words] = 1
        else:
            self.ngram_counts[n][words] += 1

    def calculate_probability(self, sequence: list):
        t = len(sequence)
        return self._backoff(t, sequence)
    
    
    def _backoff(self, n: int, sequence: list):
        if n == 1:
            return self.ngram_counts[1].get(sequence[0], 0) / sum(self.ngram_counts[1].values())
        count = self.ngram_counts[n].get(" ".join(sequence), 0)
        if count > 0:
            return count / self.ngram_counts[n-1].get(" ".join(sequence[:-1]), 1)
        else:
            return self._backoff(n-1, sequence[1:])
        