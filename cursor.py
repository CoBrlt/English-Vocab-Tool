import re


class Cursor:
    def __init__(self, text):

        self.global_char = 0 #prend en compte les balises
        self.paragraphe = 1 #numéro du paragraphe (ne prend pas en compte les balises)
        self.paragraphe_char = 0 #numéro du charactère dans le paragraphe (ne prend pas en compte les balises)
        self.text = text
        self.balise_type = "" #trouver le type d'une balise
        self.into_balise = False #savoir si on est entre '<' et '>'
        self.begin_balise_location = "" #noter le paragraphe et caractère correspondant au début
        self.end_balise_location = "" #note le paragraphe et caractère correspondant à la fin
        self.between_balise_type = "" #enregistrer le nom de la balise pour trouver la fermante
        self.style_type = ""

        self.dict_regex = {r'<color="#([A-Fa-f0-9]{6})">' : "</color>", r'<size="([0-9]{1,9})">' : "</size>", "<center>":"</center>", "<underline>":"</underline>", "<strong>":"</strong>",}

    
    def reset(self):
        self.global_char = 0 #prend en compte les balises
        self.paragraphe = 1 #numéro du paragraphe (ne prend pas en compte les balises)
        self.paragraphe_char = 0 #numéro du charactère dans le paragraphe (ne prend pas en compte les balises)
        self.balise_type = "" #trouver le type d'une balise
        self.into_balise = False #savoir si on est entre '<' et '>'
        self.begin_balise_location = "" #noter le paragraphe et caractère correspondant au début
        self.end_balise_location = "" #note le paragraphe et caractère correspondant à la fin
        self.between_balise_type = "" #enregistrer le nom de la balise pour trouver la fermante
        self.style_type = ""

    def go_next(self):
        
        # print(len(self.text)-1, self.global_char)
        
        if len(self.text)-1 == self.global_char:
            return False
        
        if self.text[self.global_char] == ">":
            self.global_char+=1
            self.into_balise = False
            return True
        
        if self.text[self.global_char+1] == "<" or self.into_balise:
            self.into_balise = True
            self.global_char+=1
            return True
        
        if self.text[self.global_char] == "\n":
            self.paragraphe += 1
            self.paragraphe_char = 0
            self.global_char += 1
        else:
            self.paragraphe_char += 1
            self.global_char +=1
        
        return True
    
    def get_char(self):
        return self.text(self.global_char)
    

    def go_begin(self):
        self.global_char = 0
        self.paragraphe = 1
        self.paragraphe_char = 0
    
    def get_first_balise_open(self):
        
        while self.go_next():
            if self.into_balise:
                self.balise_type += self.text[self.global_char]
            
            # print(self.balise_type)
            
            if not self.into_balise and "<" in self.balise_type and ">" in self.balise_type:
                # print("open   ", self.between_balise_type, "   ", self.balise_type)
                self.begin_balise_location = str(self.paragraphe) + "." + str(self.paragraphe_char)
                self.between_balise_type = self.balise_type
                self.balise_type = ""
                return True
        return False
    
    def get_balise_close(self):
        
        while self.go_next():
            if self.into_balise:
                    self.balise_type += self.text[self.global_char]
                
            if not self.into_balise and "</" in self.balise_type and ">" in self.balise_type:
                # print("close   ", self.between_balise_type, "   ", self.balise_type,"  \nregex : ", bool(re.search(r'<color="#([A-Fa-f0-9]{6})">' ,self.between_balise_type)))
                for c, v in self.dict_regex.items():
                    if bool(re.search(c ,self.between_balise_type)) and v in self.balise_type:
                        self.text = re.sub(c, '', self.text, 1)
                        self.text = re.sub(v, '', self.text, 1)
                        self.end_balise_location = str(self.paragraphe) + "." + str(self.paragraphe_char)
                        self.go_begin()
                        return
            
        return
    
    def init_style_type(self):
        if self.between_balise_type == "<strong>":
            self.style_type = "strong"
        elif self.between_balise_type == "<center>":
            self.style_type = "center"
        elif self.between_balise_type == "<underline>":
            self.style_type = "underline"
        elif bool(re.search(r'<color="#([A-Fa-f0-9]{6})">' ,self.between_balise_type)):
            color = self.between_balise_type.replace("<color=\"", "")[:7]
            self.style_type = color
        elif bool(re.search(r'<size="([0-9]{1,9})">' ,self.between_balise_type)):
            size = self.between_balise_type.replace("<size=\"", "").replace("\">", "")
            self.style_type = size
        return
    
    def get_style_type(self):
        return self.style_type
    
    def get_style_location(self):
        return (self.begin_balise_location, self.end_balise_location)
    
    def get_text(self):
        return self.text
    
