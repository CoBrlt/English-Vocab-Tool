import tkinter as tk
from tkinter import Menu, ttk
from bs4 import BeautifulSoup
import requests
from word import Word

url = "https://www.deepl.com/fr/translator#en/fr/"


def readFile():
    fichier = open("./english_words.txt", "r")
    contenu = fichier.read()
    fichier.close()
    contenu = contenu.split("\n")

    while "" in contenu:
        contenu.remove("")
    
    tab_words = []
    for word in contenu:
        tab_words.append(Word(word))
    
    return tab_words


def writeFile(tab_words):
    with open('fichier.txt', 'w') as f:
        for word in tab_words:
            f.write(word.toStringForSave()+"\n")
    return


def getTranslationByDeepl(words):
    for word in words:
        if word.get_fr_words() == []:
            print("Translating "+ word.get_en_word() + "...")
            word.search_translation()
            print("Translating "+ word.get_en_word() + " : Success")
            writeFile(words)
    return





def create_table():
    table = ttk.Treeview(root, columns=("English", "French"), show="headings")
    table.heading("English", text="English")
    table.heading("French", text="French")

    words = getArrayVocab()

    font_style = ("Helvetica", 12)
    table.tag_configure("centered", font=font_style, anchor="center")

    for word in words:
        table.insert("", "end", values=(word, ""), tags="centered")

    table.pack(expand=True, fill="both")

def remove_all_widgets(root):
    for widget in root.winfo_children():
        widget.destroy()

def button():
    # bouton = tk.Button(root, text="Cliquez ici")
    # bb = tk.Button(root, text="salut")

    # def action_bouton():
    #     print("Bouton cliqué !")

    # bouton.config(command=action_bouton)
    # bb.config(command=action_bouton)

    # bouton.pack()
    # bb.pack()
    return

def main():
    root = tk.Tk()
    root.title("English Vocab Tool")
    root.geometry("1100x900")
    create_table()
    remove_all_widgets(root)
    root.mainloop()
    return


# main()

t = readFile()
getTranslationByDeepl(t)
writeFile(t)


#C:\Users\coren\AppData\Local\Programs\Python\Python310\python.exe app.py
