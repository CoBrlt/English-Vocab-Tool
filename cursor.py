class Cursor:
    def __init__(self, text):

        self.global_char = 0
        self.paragraphe = 1
        self.paragraphe_char = 0
        self.text = text
        self.balise_type = ""
        self.into_balise = False
        self.start_balise = ""
        self.end_balise = ""

    def go_next():

        if len(self.text)-1 == self.global_char:
            return False
        
        if self.global_char+1 == ">":
            self.global_char+=1
            self.into_balise = False
            return True
        
        if self.global_char+1 == "<" or self.into_balise == True:
            self.into_balise = True
            self.global_char+=1
            return True
        
        if self.global_char+1 == "\n":
            self.paragraphe += 1
            self.paragraphe_char = 0
            self.global_char += 1
        else:
            self.char += 1
        
        return True
    
    def get_char():
        return self.text(self.global_char)
    

    def go_begin():
        self.global_char = 0
        self.paragraphe = 1
        self.paragraphe_char = 0
    
    def get_first_balise_open():
        
        return



            