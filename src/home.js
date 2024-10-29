const { ipcRenderer } = require('electron');
const List = require("./List.js");
const AskServer = require('./AskServer.js');
// var selectOptionChoosen = null
var english_hidden = false
var wordChoosen = null
var counter = 0
var isListOption = true
var listChoosen = null


document.addEventListener("DOMContentLoaded", (event) => {

    // Envoi de données au processus principal
    // ipcRenderer.send('ask-data', 'file-list');

    // // Réception de données depuis le processus principal
    // ipcRenderer.on('response-file-list', (event, data) => {
    //     // console.log('Données reçues du main :', data);
    //     const select = document.getElementById("list_selector")
    //     for (let file_name of data) {
    //         file_name = file_name.replace(".json", "")
    //         const newOption = document.createElement("option")
    //         newOption.value = file_name
    //         newOption.textContent = file_name
    //         select.appendChild(newOption);
    //     }
    // });
    
    const select = document.getElementById("list_selector")
    select.addEventListener("change", async (event)=> {
        let selectOptionChoosen = event.target.value
        if(isListOption){
            let content = await AskServer.askServerToGetListContent(selectOptionChoosen)
            listChoosen = new List()
            listChoosen.fromJson(content)
            counter = 0
            counterHtml = document.getElementById("counter")
            counterHtml.textContent = counter.toString() + "/" + listChoosen.length().toString()
        }else{
            let listsForGroup = await AskServer.askServerToGetListsInGroup(selectOptionChoosen)
            listChoosen = new List("listChoosen", [], [])
            let content = null
            let tmpList = null
            for(let listName of listsForGroup){
                content = await AskServer.askServerToGetListContent(listName)
                tmpList = new List()
                tmpList.fromJson(content)
                listChoosen.mergeList(tmpList)
            } 
        }
    })

    // ipcRenderer.on("response-content-file", (event, data) => {
    //     listChoosen = new List()
    //     listChoosen.fromJson(data)
    //     counter = 0
    //     counterHtml = document.getElementById("counter")
    //     counterHtml.textContent = counter.toString() + "/" + listChoosen.length().toString()
    // })

    handleButtonUseList()
    handleButtonUseGroups()
    handleSelectForList()


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

function handleButtonUseList(){
    let button_use_lists = document.getElementById("button_use_lists")
    button_use_lists.addEventListener("click", ()=>{
        let button_use_groups = document.getElementById("button_use_groups")
        button_use_groups.style.display = "block"
        button_use_lists.style.display = "none"
        handleSelectForList()
        isListOption = true
    })
}

function handleButtonUseGroups(){
    let button_use_groups = document.getElementById("button_use_groups")
    button_use_groups.addEventListener("click", ()=>{
        let button_use_lists = document.getElementById("button_use_lists")
        button_use_lists.style.display = "block"
        button_use_groups.style.display = "none"
        handleSelectForGroups()
        isListOption = false
    })
}

async function handleSelectForGroups(){
    const select = document.getElementById("list_selector")
    select.innerHTML = ""
    let data = await AskServer.askServerToGetGroups()
    data = JSON.parse(data)
    let defaultOption = document.createElement("option")
    defaultOption.value = "Please choose a group"
    defaultOption.textContent = "Please choose a group"
    select.appendChild(defaultOption)
    for (let group of Object.keys(data)) {
        const newOption = document.createElement("option")
        newOption.value = group
        newOption.textContent = group
        select.appendChild(newOption);
    }
}

async function handleSelectForList(){
    const select = document.getElementById("list_selector")
    select.innerHTML = ""
    let data = await AskServer.askServerToGetListNames()
    let defaultOption = document.createElement("option")
    defaultOption.value = "Please choose a list"
    defaultOption.textContent = "Please choose a list"
    select.appendChild(defaultOption)
    for (let file_name of data) {
        file_name = file_name.replace(".json", "")
        const newOption = document.createElement("option")
        newOption.value = file_name
        newOption.textContent = file_name
        select.appendChild(newOption);
    }
}

//voir si on a pas déjà des fonctions pour faire les trucs
// et centraliser les contacts serveur dans un fichier