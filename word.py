import deepl_translation as Translate

class Word:
    def __init__(self, en_word):
        self.en_word = en_word
        self.fr_words = []
        self.examples = {}

    def get_en_word(self):
        return self.en_word

    def set_en_word(self, en_word):
        self.en_word = en_word

    def get_fr_words(self):
        return self.fr_words

    def set_fr_words(self, fr_words):
        self.fr_words = fr_words

    def get_examples(self):
        return self.examples

    def set_examples(self, examples):
        self.examples = examples

    def add_fr_word(self, fr_word):
        self.fr_words.append(fr_word)

    def add_example(self, fr_word, en_example):
        self.examples[fr_word] = en_example

    def search_translation(self):
        soup = Translate.getSoup(self.en_word)

        if soup != [] :
            self.examples = Translate.search_translation_examples(soup)
            self.fr_words = Translate.search_translation_words(soup)
        return