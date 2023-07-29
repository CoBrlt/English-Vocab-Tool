import tools as Tools
import tkinter as tk
from tkinter import font, ttk
from cursor import Cursor
import re




def display(root, text):
    # Supprimer tous les widgets existants dans la fenêtre
    Tools.remove_all_widgets(root)

    # Créer un widget Text pour afficher le texte centré
    # label = tk.Text(root, font=("Arial", 12), wrap="word", height=root.winfo_height(), width=root.winfo_width())

    # Supprimer les bordures en définissant highlightthickness à 0

    # Changer la couleur de fond du widget Text pour correspondre à la couleur de fond de la fenêtre

    
    listeCombo = Tools.init_combobox(root, Tools.get_all_vocab_files())
    Tools.display_combobox(listeCombo)
    listeCombo.bind("<<ComboboxSelected>>", Tools.changeFile)

    text = text.replace("#!grammar!#", "")
    text = text.replace("\n", "")
    text = text.replace("#!br!#", "\n")
    text = " " + text + " "
    apply_front(text, root)
    

    

    # text = "Un mot en bleu, et un mot en noirEmensis itaque difficultatibus multis et nive obrutis callibus plurimis ubi prope Rauracum ventum est ad supercilia fluminis Rheni, resistente multitudine Alamanna pontem suspendere navium conpage Romani vi nimia vetabantur ritu grandinis undique convolantibus telis, et cum id inpossibile videretur, imperator cogitationibus magnis attonitus, quid capesseret ambigebat.\nCoactique aliquotiens nostri pedites ad eos persequendos scandere clivos sublimes etiam si lapsantibus plantis fruticeta prensando vel dumos ad vertices venerint summos, inter arta tamen et invia nullas acies explicare permissi nec firmare nisu valido gressus: hoste discursatore rupium abscisa volvente, ruinis ponderum inmanium consternuntur, aut ex necessitate ultima fortiter dimicante, superati periculose per prona discedunt.\nSed ut tum ad senem senex de senectute, sic hoc libro ad amicum amicissimus scripsi de amicitia. Tum est Cato locutus, quo erat nemo fere senior temporibus illis, nemo prudentior; nunc Laelius et sapiens (sic enim est habitus) et amicitiae gloria excellens de amicitia loquetur. Tu velim a me animum parumper avertas, Laelium loqui ipsum putes. C. Fannius et Q. Mucius ad socerum veniunt post mortem Africani; ab his sermo oritur, respondet Laelius, cuius tota disputatio est de amicitia, quam legens te ipse cognosces.\nEx turba vero imae sortis et paupertinae in tabernis aliqui pernoctant vinariis, non nulli velariis umbraculorum theatralium latent, quae Campanam imitatus lasciviam Catulus in aedilitate sua suspendit omnium primus; aut pugnaciter aleis certant turpi sono fragosis naribus introrsum reducto spiritu concrepantes; aut quod est studiorum omnium maximum ab ortu lucis ad vesperam sole fatiscunt vel pluviis, per minutias aurigarum equorumque praecipua vel delicta scrutantes.\nEius populus ab incunabulis primis ad usque pueritiae tempus extremum, quod annis circumcluditur fere trecentis, circummurana pertulit bella, deinde aetatem ingressus adultam post multiplices bellorum aerumnas Alpes transcendit et fretum, in iuvenem erectus et virum ex omni plaga quam orbis ambit inmensus, reportavit laureas et triumphos, iamque vergens in senium et nomine solo aliquotiens vincens ad tranquilliora vitae discessit.."
    # text = "\n\n\n\n" + text
    
    #x.y  ---> x correspond au début du paragraphe numéro x et y au nombre de caractère à partir du début du paragraphe x
    
    # Appliquer la balise "blue" pour le mot "bleu"
    # label.tag_add("blue", "1.0", "3.50")

    # Appliquer la balise "center" pour centrer le texte
    # label.tag_add("center", "1.0", "end")


    # Appliquer la balise "big" au mot "plus" pour le rendre plus grand
    # label.tag_add("big", "1.33", "1.37")

    # Appliquer la balise "bold" au mot "gras" pour le mettre en gras
    # label.tag_add("bold", "1.41", "1.45")

    


def apply_front(text, root):
    tab_all_styles = []
    cursor = Cursor(text)
    balise_remaining = True
    while balise_remaining:
        balise_remaining = cursor.get_first_balise_open()

        if not balise_remaining:
            break
        
        # print("open find")
        cursor.get_balise_close()
        # print("close find")
        cursor.init_style_type()
        # print("type find")
        locations = cursor.get_style_location()
        tab_all_styles.append([cursor.get_style_type(), locations])
        # print("----------------------------------")
        cursor.reset()

    text = cursor.get_text()
    text = text[:-1]
    text = text[1:]

    label = Tools.init_label(root, text)

    count_new_style = 0
    for style in tab_all_styles:
        if style[0][0] == "#":#si c'est une couleur
            tag = "color"+str(count_new_style)
            label.tag_configure(tag, foreground=style[0])
            label.tag_add(tag, style[1][0], style[1][1])
            count_new_style+=1
        elif re.fullmatch(r'^\d+$', style[0]):#taille de police
            police = int(style[0])
            tag = "color"+str(count_new_style)
            label.tag_configure(tag, font=("Arial", police))
            label.tag_add(tag, style[1][0], style[1][1])
            count_new_style+=1
        else:
            label.tag_add(style[0], style[1][0], style[1][1])
        
    
    #label.tag_configure("blue", foreground="blue")# hexa : foreground="#FFFFFF"
    # label.tag_configure("center", justify='center')
    # label.tag_configure("underline", font=("Arial", 12, "underline"))

    # label.tag_add("underline", 2.0, "end")

    label.config(state=tk.DISABLED)
    return text
