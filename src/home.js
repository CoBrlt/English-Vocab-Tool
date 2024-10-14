const { ipcRenderer } = require('electron');
const List = require("./List.js")
var listChoosen = null
var english_hidden = false
var wordChoosen = null
var counter = 0 

document.addEventListener("DOMContentLoaded", (event) => {


    // Envoi de données au processus principal
    ipcRenderer.send('ask-data', 'file-list');

    // Réception de données depuis le processus principal
    ipcRenderer.on('response-file-list', (event, data) => {
        // console.log('Données reçues du main :', data);
        const select = document.getElementById("list_selector")
        for (let file_name of data) {
            file_name = file_name.replace(".json", "")
            const newOption = document.createElement("option")
            newOption.value = file_name
            newOption.textContent = file_name
            select.appendChild(newOption);
        }
    });

    ipcRenderer.on("response-content-file", (event, data) => {
        listChoosen = new List()
        listChoosen.fromJson(data)
        counter = 0
        counterHtml = document.getElementById("counter")
        counterHtml.textContent = counter.toString() + "/" + listChoosen.length().toString()
    })

    const select = document.getElementById("list_selector")
    select.addEventListener("change", function (event) {
        let listNameChoosen = event.target.value
        ipcRenderer.send("ask-content-file", listNameChoosen)
    })

    document.addEventListener("keydown", (event) =>{
        if(event.key == "Enter" && listChoosen.length() > 0){
            if(!english_hidden){
                let wordIndex = getRandomInt(0, listChoosen.length()-1)
                wordChoosen = listChoosen.getWordByIndex(wordIndex)
                
                const paragraph_english = document.querySelector("#english_word p")
                paragraph_english.textContent = wordChoosen.getEnglish()

                const paragraph_french = document.querySelector("#french_word p")
                paragraph_french.textContent = ""

                english_hidden = true
            }else{
                let translation = ""
                for(let frenchWord of wordChoosen.getFrench()){
                    translation += escapeHTML(frenchWord) + "</br>"
                }
                translation = translation.slice(0, -5);  // Supprime les 4 derniers caractères


                if(wordChoosen.getExamples().length > 0){
                    translation += "<hr style=\"border: 1px solid black\">"
                }

                for(let example of wordChoosen.getExamples()){
                    translation += '<span class="example exempleEnglish">' + 
                    escapeHTML(example.getEnglish()) + 
                    "</span></br><span class='example exampleFrench'>" + 
                    escapeHTML(example.getFrench()) + 
                    "</span></br></br>";
                }

                const paragraph_french = document.querySelector("#french_word p")
                paragraph_french.innerHTML = translation
                english_hidden = false

                counter++
                counterHtml = document.getElementById("counter")
                counterHtml.textContent = counter.toString() + "/" + listChoosen.length().toString()
            }
        }
    })


});

function getRandomInt(min, max) {
    // Assurez-vous que min et max sont des entiers
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function escapeHTML(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
