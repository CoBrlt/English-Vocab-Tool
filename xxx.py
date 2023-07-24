import tools as Tools
import tkinter as tk
from tkinter import font, ttk

def display(root):
    # Supprimer tous les widgets existants dans la fenêtre
    Tools.remove_all_widgets(root)

    # Créer un widget Text pour afficher le texte centré
    # label = tk.Text(root, font=("Arial", 12), wrap="word", height=root.winfo_height(), width=root.winfo_width())

    # Supprimer les bordures en définissant highlightthickness à 0

    # Changer la couleur de fond du widget Text pour correspondre à la couleur de fond de la fenêtre

    
    listeCombo = Tools.init_combobox(root, Tools.get_all_vocab_files())
    Tools.display_combobox(listeCombo)
    listeCombo.bind("<<ComboboxSelected>>", changeFile)
    

    

    text = "Un mot en bleu, et un mot en noirEmensis itaque difficultatibus multis et nive obrutis callibus plurimis ubi prope Rauracum ventum est ad supercilia fluminis Rheni, resistente multitudine Alamanna pontem suspendere navium conpage Romani vi nimia vetabantur ritu grandinis undique convolantibus telis, et cum id inpossibile videretur, imperator cogitationibus magnis attonitus, quid capesseret ambigebat.\nCoactique aliquotiens nostri pedites ad eos persequendos scandere clivos sublimes etiam si lapsantibus plantis fruticeta prensando vel dumos ad vertices venerint summos, inter arta tamen et invia nullas acies explicare permissi nec firmare nisu valido gressus: hoste discursatore rupium abscisa volvente, ruinis ponderum inmanium consternuntur, aut ex necessitate ultima fortiter dimicante, superati periculose per prona discedunt.\nSed ut tum ad senem senex de senectute, sic hoc libro ad amicum amicissimus scripsi de amicitia. Tum est Cato locutus, quo erat nemo fere senior temporibus illis, nemo prudentior; nunc Laelius et sapiens (sic enim est habitus) et amicitiae gloria excellens de amicitia loquetur. Tu velim a me animum parumper avertas, Laelium loqui ipsum putes. C. Fannius et Q. Mucius ad socerum veniunt post mortem Africani; ab his sermo oritur, respondet Laelius, cuius tota disputatio est de amicitia, quam legens te ipse cognosces.\nEx turba vero imae sortis et paupertinae in tabernis aliqui pernoctant vinariis, non nulli velariis umbraculorum theatralium latent, quae Campanam imitatus lasciviam Catulus in aedilitate sua suspendit omnium primus; aut pugnaciter aleis certant turpi sono fragosis naribus introrsum reducto spiritu concrepantes; aut quod est studiorum omnium maximum ab ortu lucis ad vesperam sole fatiscunt vel pluviis, per minutias aurigarum equorumque praecipua vel delicta scrutantes.\nEius populus ab incunabulis primis ad usque pueritiae tempus extremum, quod annis circumcluditur fere trecentis, circummurana pertulit bella, deinde aetatem ingressus adultam post multiplices bellorum aerumnas Alpes transcendit et fretum, in iuvenem erectus et virum ex omni plaga quam orbis ambit inmensus, reportavit laureas et triumphos, iamque vergens in senium et nomine solo aliquotiens vincens ad tranquilliora vitae discessit.."
    # text = "\n\n\n\n" + text
    label = Tools.init_label(root, text)
    #x.y  ---> x correspond au début du paragraphe numéro x et y au nombre de caractère à partir du début du paragraphe x
    
    # Appliquer la balise "blue" pour le mot "bleu"
    label.tag_add("blue", "1.0", "3.50")

    # Appliquer la balise "center" pour centrer le texte
    label.tag_add("center", "1.0", "end")


    # Appliquer la balise "big" au mot "plus" pour le rendre plus grand
    label.tag_add("big", "1.33", "1.37")

    # Appliquer la balise "bold" au mot "gras" pour le mettre en gras
    label.tag_add("bold", "1.41", "1.45")

    label.config(state=tk.DISABLED)