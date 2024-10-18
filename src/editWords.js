const { ipcRenderer } = require('electron');
const List = require("./List.js")
var currentList = null;


document.addEventListener("DOMContentLoaded", (event) => {

    let listToEdit = getListToEdit()
    document.getElementById("title_table").textContent = "List Name : " + listToEdit

    ipcRenderer.send("ask-content-file", listToEdit)

    ipcRenderer.on('response-content-file', (event, data) => {
        currentList = new List()
        currentList.fromJson(data)
        console.log(currentList)
        createAllLines()
    });
})

function createAllLines(){
    let listWords = currentList.getWords()
    let tbody = document.getElementById("tbody_words")
    for(let word of listWords){
        let tr = createLine(word)
        tbody.appendChild(tr)
    }
}

function createLine(word){
    let newTr = document.createElement("tr")

    let tdEnglishField = createEnglishField(word.getEnglish())
    let tdTranslationField = createTranslationField(word.getFrench())
    let tdExamplesFiled = createExamplesField(word.getExamples())

    let tdSave = document.createElement("td")
    let buttonSave = document.createElement("button")
    buttonSave.className = "button"
    buttonSave.textContent = "Save"
    buttonSave.style.display = "none"
    tdSave.append(buttonSave)

    let tdDelete = document.createElement("td")
    let buttonDelete = document.createElement("button")
    buttonDelete.className = "button"
    buttonDelete.textContent = "Delete"
    tdDelete.append(buttonDelete)

    newTr.appendChild(tdEnglishField)
    newTr.appendChild(tdTranslationField)
    newTr.appendChild(tdExamplesFiled)
    newTr.appendChild(tdSave)
    newTr.appendChild(tdDelete)

    return newTr
}

function createEnglishField(englishWord){
    let td = document.createElement("td")
    td.className = "english"
    
    let input = document.createElement("input")
    input.type = "text"
    input.className = "editable"
    input.placeholder = "Enter English word"
    input.value = englishWord

    td.append(input)
    return td
}

function createTranslationField(translationsList){
    let td = document.createElement("td")
    td.className = "translations"

    for(let translation of translationsList){
        let div = document.createElement("div")
        div.className = "translation-item"

        let input = document.createElement("input")
        input.type = "text"
        input.className = "editable"
        input.value = translation

        let buttonRemove = document.createElement("button")
        buttonRemove.className = "btn-remove"
        buttonRemove.textContent = "×"
    
        div.appendChild(input)
        div.appendChild(buttonRemove)
        td.appendChild(div)
    }

    let buttonAdd = document.createElement("button")
    buttonAdd.className = "btn-add"
    buttonAdd.textContent = "Add translation"
    
    td.appendChild(buttonAdd)
    return td
}


function createExamplesField(examplesList){
    let td = document.createElement("td")
    td.className = "examples"

    for(let example of examplesList){
        let div = document.createElement("div")
        div.className = "example-item"

        let createTextArea = (content)=>{
            let textArea = document.createElement("textarea")
            textArea.className = "editable"
            textArea.textContent = content
            return textArea
        }  

        let englishTextArea = createTextArea(example.getEnglish())
        let frenchTextArea = createTextArea(example.getFrench())               

        let buttonRemove = document.createElement("button")
        buttonRemove.className = "btn-remove"
        buttonRemove.textContent = "×"
    
        div.appendChild(englishTextArea)
        div.appendChild(frenchTextArea)
        div.appendChild(buttonRemove)
        td.appendChild(div)
    }

    let buttonAdd = document.createElement("button")
    buttonAdd.className = "btn-add"
    buttonAdd.textContent = "Add example"
    
    td.appendChild(buttonAdd)
    return td
}


function getListToEdit(){
    return "all"
}