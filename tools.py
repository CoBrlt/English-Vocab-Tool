import tkinter as tk
from tkinter import font, ttk
import os


def remove_all_widgets(root):
    for widget in root.winfo_children():
        widget.destroy()

def init_fonts(label):
    label.tag_configure("blue", foreground="blue")# hexa : foreground="#FFFFFF"
    label.tag_configure("center", justify='center')
    label.tag_configure("big", font=("Arial Black", 16))
    label.tag_configure("bold", font=("Arial Black", 12, "bold"))
    return

def init_label(root, text):
    label = tk.Text(root, font=("Arial", 12), wrap="word", height=root.winfo_height(), width=root.winfo_width())
    label.config(highlightthickness=0)
    label.configure(bg=root.cget('bg'))
    label.pack(padx=0, pady=0)
    label.config(state=tk.NORMAL)
    label.delete(1.0, tk.END)
    label.insert(tk.END, text)
    init_fonts(label)
    return label

def init_combobox(root, listeFiles):
    listeCombo = ttk.Combobox(root, values=listeFiles)
    return listeCombo

def display_combobox(listeCombo):
    listeCombo.pack()

def get_all_vocab_files():
    list_files = []
    path = './vocab_files/'
    
    files = os.listdir(path)
    for name in files:
        list_files.append(name.replace(".txt", ""))
    
    return list_files

def changeFile(event):
    print("ok")    