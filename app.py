import tkinter as tk
from tkinter import Menu, ttk
from bs4 import BeautifulSoup
import requests
from word import Word
import random

url = "https://www.deepl.com/fr/translator#en/fr/"
all_words_tab = []
count_tap = 0
root = tk.Tk()


def readFile():
    fichier = open("./fichier.txt", "r", encoding="utf-8")
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
    with open('fichier.txt', 'w', encoding="utf-8") as f:
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

def on_key_press(event):
    global count_tap
    global choosen
    if event.keysym == "Return":
        if count_tap%2 == 0:
            index = random.randint(0, len(all_words_tab)-1)
            choosen = all_words_tab[index]
            texte_gauche.config(text=choosen.get_en_word())
            texte_droite.config(text="")
            texte_nb_word.config(text=str(count_tap//2)+" / "+str(len(all_words_tab)))
        else:
            texte_gauche.config(text=choosen.get_en_word())
            texte_droite.config(text=choosen.toStringForPrint())
        count_tap += 1

def main(t):
    global all_words_tab
    all_words_tab = t
    root.title("English Vocab Tool")
    root.geometry("1200x900")
    remove_all_widgets(root)
    # Créer les deux sous-fenêtres (Frames)
    global frame1
    global frame2
    frame1 = tk.Frame(root, width=550, height=900)
    frame2 = tk.Frame(root, width=650, height=900)
    seperate = tk.Frame(root, bg='black', width=5, height=900)
    seperate_top = tk.Frame(root, bg='black', width=1100, height=5)

    # Positionner les sous-fenêtres dans la fenêtre principale
    seperate_top.pack(side="top", fill="x")
    frame1.pack(side='left', fill='y')
    seperate.pack(side='left', fill='y')
    frame2.pack(side='right', fill='y')

    global texte_droite
    global texte_gauche
    global texte_nb_word
    texte_gauche = tk.Label(frame1, text="click enter", font=("Arial Black", 14))
    texte_gauche.place(relx=0.5, rely=0.5, anchor="center")
    texte_droite = tk.Label(frame2, text="", font=("Arial Black", 10))
    texte_droite.place(relx=0.5, rely=0.5, anchor="center")
    texte_nb_word = tk.Label(frame1, text="0 / "+str(len(all_words_tab)), font=("Arial", 14))
    texte_nb_word.place(relx=0, rely=0, anchor="nw")
    

    #create_table()
    root.bind("<Key>", on_key_press)
    # Texte à gauche de la séparation
    root.mainloop()
    return



t = readFile()
getTranslationByDeepl(t)
writeFile(t)
main(t)


#C:\Users\coren\AppData\Local\Programs\Python\Python310\python.exe app.py
