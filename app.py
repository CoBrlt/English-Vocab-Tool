import tkinter as tk
from tkinter import Menu, ttk

def create_table():
    table = ttk.Treeview(root, columns=("English", "French"), show="headings")
    table.heading("English", text="English")
    table.heading("French", text="French")
    table.pack()

    # Ajouter des données au tableau
    table.insert("", "end", values=("Hello", "Bonjour"))
    table.insert("", "end", values=("Goodbye", "Au revoir"))
    table.insert("", "end", values=("Yes", "Oui"))
    table.insert("", "end", values=("No", "Non"))

root = tk.Tk()
root.title("Tableau multilingue")
root.geometry("400x300")

# Créer un menu
menu_bar = Menu(root)
root.config(menu=menu_bar)

file_menu = Menu(menu_bar, tearoff=0)
menu_bar.add_cascade(label="Fichier", menu=file_menu)
file_menu.add_command(label="Quitter", command=root.quit)

# Créer le tableau
create_table()

root.mainloop()
