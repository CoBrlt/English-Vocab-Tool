import deepl_translation as Translate

class Word:
    def __init__(self, en_word):

        if not "=" in en_word:
            self.en_word = en_word
            self.fr_words = []
            self.examples = {}
        else:
            self.fr_words = []
            self.examples = {}

            tab = en_word.split("=")
            self.en_word = tab[0]

            if tab[1] != "":
                self.fr_words = tab[1].split("|")
            else:
                tab[1] = []

            if len(tab) >= 3:
                tmp = tab[2].split("|")
                for i in range(len(tmp)):
                    tmp[i] = tmp[i].split(":")
                    # print(tab)
                    self.examples[tmp[i][0]] = tmp[i][1]

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
        all_soup = Translate.getSoup(self.en_word)
        soup = Translate.getDetailsTranslation(all_soup)

        if soup != [] :
            self.examples = Translate.search_translation_examples(soup)
            self.fr_words = Translate.search_translation_words(soup)
        else:
            self.fr_words.append(Translate.getSimpleTraduction(all_soup))
        
        if self.fr_words == []:
            self.fr_words.append(Translate.getSimpleTraduction(all_soup))
        
        #print(self.fr_words)
        
        return
    
    def toStringForSave(self):
        string = ""
        string += self.en_word

        if len(self.en_word) != 0:
            string += "="
        
        for word in self.fr_words:
            string += word + "|"
        
        if len(self.fr_words) != 0:
            string = string[:-1]

        if len(self.examples) != 0:
            string += "="
        
        for example in self.examples:
            string += example + ":" + self.examples[example]+"|"
        
        if len(self.examples) != 0:
            string = string[:-1]

        return string
    
    def toStringForPrint(self):
        string = ""

        for word in self.fr_words:
            string += "- " + word.capitalize() + "\n"
        
        if len(self.examples) != 0:
            string += "--------------------\n"
        
        i = 0
        for example in self.examples:
            if i < 5 :
                string += example + "\n" + self.examples[example]+"\n\n\n"
                i += 1
        
        if len(self.examples) != 0:
            string = string[:-1]
            string = string[:-1]
            string = string[:-1]
        
        return string
            