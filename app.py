import tkinter as tk
from tkinter import Menu, ttk
from bs4 import BeautifulSoup
import requests
from word import Word
import os
import random

url = "https://www.deepl.com/fr/translator#en/fr/"
all_words_tab = []
count_tap = 0
root = tk.Tk()


def readFile():
    fichier = open("./vocab_files/"+ fileName +".txt", "r", encoding="utf-8")
    contenu = fichier.read()
    fichier.close()
    contenu = contenu.split("\n")

    while "" in contenu:
        contenu.remove("")
    
    global all_words_tab
    all_words_tab = []
    for word in contenu:
        all_words_tab.append(Word(word))
    
    
    
    # all_words_tab = tab_words
    #return tab_words


def writeFile():
    with open("./vocab_files/"+ fileName +".txt", 'w', encoding="utf-8") as f:
        for word in all_words_tab:
            f.write(word.toStringForSave()+"\n")
    return


def getTranslationByDeepl(words):
    for word in words:
        if word.get_fr_words() == []:
            print("Translating "+ word.get_en_word() + "...")
            word.search_translation()
            print("Translating "+ word.get_en_word() + " : Success")
            writeFile()
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


def translate_submit():
    getTranslationByDeepl(all_words_tab)

def save_submit():
    writeFile()

def input_submit():
    all_words_tab.append(Word(input_text.get()))
    input_text.delete(0, tk.END)


def create_frame():
    global frame1
    global frame2
    frame1 = tk.Frame(root, width=550, height=900)
    frame2 = tk.Frame(root, width=650, height=900)
    seperate = tk.Frame(root, bg='black', width=5, height=900)
    seperate_top = tk.Frame(root, bg='black', width=1100, height=5)

    seperate_top.pack(side="top", fill="x")
    frame1.pack(side='left', fill='y')
    seperate.pack(side='left', fill='y')
    frame2.pack(side='right', fill='y')

def text_field():
    global texte_droite
    global texte_gauche
    global texte_nb_word
    texte_gauche = tk.Label(frame1, text="click enter", font=("Arial Black", 14))
    texte_gauche.place(relx=0.5, rely=0.5, anchor="center")
    texte_droite = tk.Label(frame2, text="", font=("Arial Black", 10))
    texte_droite.place(relx=0.5, rely=0.5, anchor="center")
    texte_nb_word = tk.Label(frame1, text="0 / "+str(len(all_words_tab)), font=("Arial", 14))
    texte_nb_word.place(relx=0, rely=0, anchor="nw")

def input_add_text():
    global input_text
    input_text = tk.Entry(root)
    input_text.place(relx=0, rely=0.05, anchor="nw")

    submit_button = tk.Button(root, text="Submit", command=input_submit)
    submit_button.place(relx=0.07, rely=0.045, anchor="nw")

    save_button = tk.Button(root, text="Save", command=save_submit)
    save_button.place(relx=0, rely=0.08, anchor="nw")

    translate_button = tk.Button(root, text="Translate", command=translate_submit)
    translate_button.place(relx=0.07, rely=0.08, anchor="nw")

def get_all_vocab_files():
    
    list_files = []
    path = './vocab_files/'
    
    files = os.listdir(path)
    for name in files:
        list_files.append(name.replace(".txt", ""))
    
    return list_files

def changeFile(event):
    global fileName
    fileName = listeCombo.get()
    readFile()

def input_select_input():
    global fileName
    global listeCombo

    listeFiles=get_all_vocab_files()
    listeCombo = ttk.Combobox(root, values=listeFiles)
    
    if len(listeFiles) != 0:
        listeCombo.current(0)
        fileName = listeFiles[0]
        readFile()


    listeCombo.place(relx=0.15, rely=0.05, anchor="nw")
    listeCombo.bind("<<ComboboxSelected>>", changeFile)

    return



def main():
    global all_words_tab
    


    root.title("English Vocab Tool")
    root.geometry("1200x900")
    remove_all_widgets(root)

    create_frame()

    input_select_input()
    
    text_field()
    input_add_text()

    root.bind("<Key>", on_key_press)

    root.mainloop()
    return


main()


#C:\Users\coren\AppData\Local\Programs\Python\Python310\python.exe app.py
