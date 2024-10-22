const { ipcRenderer } = require('electron');
const List = require("./List.js");
const Word = require("./Word.js")
const Example = require('./Example.js');
var currentList = null;


document.addEventListener("DOMContentLoaded", (event) => {
    let html = document.getElementsByTagName("table")[0]
    html.style.display = "none"
    let listToEdit = getListToEdit()
    document.getElementById("title_table").textContent = "List Name : " + listToEdit

    ipcRenderer.send("ask-content-file", listToEdit)

    ipcRenderer.on('response-content-file', (event, data) => {
        
        currentList = new List()
        currentList.fromJson(data)
        handleLineAdd()
        createAllLines()
        html.style.display = "block"
    });
})

function handleLineAdd(){
    let btnAddWord = document.getElementById("btn-add-word")
    btnAddWord.addEventListener("click", ()=>{
        let trAdd = document.getElementById("tr-add-word")
        let word = htmlTrToObjectWord(trAdd)
        if(askServerToAddWord(word)){
            clearInputsAdd(trAdd)
            let newTr = createLine(word)
            trAdd.insertAdjacentElement("afterend", newTr)
        }
    })

    let btnAddTranslation = document.querySelector("#tr-add-word > td.translations > button.btn-add")
    let div = createEmptyTranslationInput()
    btnAddTranslation.insertAdjacentElement("beforebegin", div)
    btnAddTranslation.addEventListener("click", ()=>{
        
        let div = createEmptyTranslationInput()
        btnAddTranslation.insertAdjacentElement("beforebegin", div)
    })

    let btnAddExample = document.querySelector("#tr-add-word > td.examples > button.btn-add")
    div = createEmptyExempleInput()
    btnAddExample.insertAdjacentElement("beforebegin", div)
    btnAddExample.addEventListener("click", ()=>{
        
        let div = createEmptyExempleInput()
        btnAddExample.insertAdjacentElement("beforebegin", div)
    })
}

function createEmptyTranslationInput(){
    let div = document.createElement("div")
    div.className = "translation-item"

    let input = document.createElement("input")
    input.type = "text"
    input.className = "editable"
    input.value = ""
    input.placeholder = "Enter translation"


    let buttonRemove = document.createElement("button")
    buttonRemove.className = "btn-remove"
    buttonRemove.textContent = "×"
    buttonRemove.addEventListener("click", ()=>{
        div.remove()
    })

    div.appendChild(input)
    div.appendChild(buttonRemove)
    return div
}

function createEmptyExempleInput(){
    let div = document.createElement("div")
    div.className = "example-item"

    let createTextArea = (content, placeholder="", className="")=>{
        let textArea = document.createElement("textarea")
        textArea.className = "editable " + className
        textArea.textContent = content
        textArea.placeholder = placeholder
        return textArea
    }  
    
    let englishTextArea = createTextArea("", "Enter English Exemple", "englishExample")
    let frenchTextArea = createTextArea("", "Enter example translation", "frenchExample")

    let buttonRemove = document.createElement("button")
    buttonRemove.className = "btn-remove"
    buttonRemove.textContent = "×"
    buttonRemove.addEventListener("click", ()=>{
        div.remove()
    })

    div.appendChild(englishTextArea)
    div.appendChild(frenchTextArea)
    div.appendChild(buttonRemove)
    return div
}

function clearInputsAdd(trAdd){
    //il faut rétirer les inputs en trop
    //il faut clear l'intérieur des inputs
    let inputs = trAdd.querySelector("td.english > input")
    inputs.value = ""

    inputs = trAdd.querySelectorAll("td.translations > div.translation-item")
    for(let input of inputs){
        input.remove()
    }

    inputs = trAdd.querySelectorAll("td.examples > div.example-item")
    for(let input of inputs){
        input.remove()
    }

    let btnAddExample = trAdd.querySelector("td.examples > button.btn-add")
    let div = createEmptyExempleInput()
    btnAddExample.insertAdjacentElement("beforebegin", div)

    let btnAddTranslation = document.querySelector("td.translations > button.btn-add")
    div = createEmptyTranslationInput()
    btnAddTranslation.insertAdjacentElement("beforebegin", div)

}

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
    newTr.id = word.getEnglish()
    
    let tdDelete = document.createElement("td")
    let buttonDelete = document.createElement("button")
    buttonDelete.className = "button"
    buttonDelete.textContent = "Delete"
    buttonDelete.addEventListener("click", async ()=>{
        let wordName = newTr.id
        if(await askServerToRemoveWord(wordName)){
            newTr.remove()
        }
    })
    tdDelete.append(buttonDelete)


    let tdSave = document.createElement("td")
    let buttonSave = document.createElement("button")
    buttonSave.className = "button"
    buttonSave.textContent = "Save"
    buttonSave.style.display = "none"
    buttonSave.addEventListener("click", async ()=>{
        let wordToSave = htmlTrToObjectWord(newTr)
        let oldNameWord = newTr.id
        if(await askServerToEditWord(oldNameWord, wordToSave)){
            buttonSave.style.display = "none"
            buttonDelete.style.display = "inline-block"
            newTr.id = wordToSave.getEnglish()
        }
    })
    tdSave.append(buttonSave)

    
    let showSaveAndHideDelete = (state)=>{
        if(state){
            buttonDelete.style.display = "none"
            buttonSave.style.display = "inline-block"
        }else{
            buttonDelete.style.display = "inline-block"
            buttonSave.style.display = "none"
        }
    }

    let tdEnglishField = createEnglishField(word.getEnglish(), showSaveAndHideDelete)
    let tdTranslationField = createTranslationField(word.getFrench(), showSaveAndHideDelete)
    let tdExamplesFiled = createExamplesField(word.getExamples(), showSaveAndHideDelete)

    newTr.appendChild(tdEnglishField)
    newTr.appendChild(tdTranslationField)
    newTr.appendChild(tdExamplesFiled)
    newTr.appendChild(tdSave)
    newTr.appendChild(tdDelete)

    return newTr
}

function createEnglishField(englishWord, showSaveAndHideDelete){
    let td = document.createElement("td")
    td.className = "english"
    
    let input = document.createElement("input")
    input.type = "text"
    input.className = "editable"
    input.placeholder = "Enter English word"
    input.value = englishWord
    input.addEventListener("input", ()=>{
        showSaveAndHideDelete(true)
    })

    td.append(input)
    return td
}

function createTranslationField(translationsList, showSaveAndHideDelete){
    let td = document.createElement("td")
    td.className = "translations"

    for(let translation of translationsList){
        let div = createInputTranslation(showSaveAndHideDelete, translation, "Enter translation")
        td.appendChild(div)
    }

    let buttonAdd = document.createElement("button")
    buttonAdd.className = "btn-add"
    buttonAdd.textContent = "Add translation"
    buttonAdd.addEventListener("click", ()=>{
        let div = createInputTranslation(showSaveAndHideDelete, "", "Enter translation")
        td.insertBefore(div, buttonAdd)
        showSaveAndHideDelete(true)
    })
    td.appendChild(buttonAdd)
    
    return td
}

function createExamplesField(examplesList, showSaveAndHideDelete){
    let td = document.createElement("td")
    td.className = "examples"

    for(let example of examplesList){
        let div = createInputExample(showSaveAndHideDelete, example)
        td.appendChild(div)
    }

    let buttonAdd = document.createElement("button")
    buttonAdd.className = "btn-add"
    buttonAdd.textContent = "Add example"
    buttonAdd.addEventListener("click", ()=>{
        let div = createInputExample(showSaveAndHideDelete, new Example("", ""))
        td.insertBefore(div, buttonAdd)
        showSaveAndHideDelete(true)
    })
    
    td.appendChild(buttonAdd)
    return td
}

function createInputExample(showSaveAndHideDelete, example=null){
    let div = document.createElement("div")
    div.className = "example-item"

    let createTextArea = (content, placeholder="", className="")=>{
        let textArea = document.createElement("textarea")
        textArea.className = "editable " + className
        textArea.textContent = content
        textArea.placeholder = placeholder
        textArea.addEventListener("input", ()=>{
            showSaveAndHideDelete(true)
        })
        return textArea
    }  
    
    let englishTextArea = createTextArea(example.getEnglish(), "Enter English Exemple", "englishExample")
    let frenchTextArea = createTextArea(example.getFrench(), "Enter example translation", "frenchExample")

    let buttonRemove = document.createElement("button")
    buttonRemove.className = "btn-remove"
    buttonRemove.textContent = "×"
    buttonRemove.addEventListener("click", ()=>{
        div.remove()
        showSaveAndHideDelete(true)
    })

    div.appendChild(englishTextArea)
    div.appendChild(frenchTextArea)
    div.appendChild(buttonRemove)
    return div
}


function createInputTranslation(showSaveAndHideDelete, translation="", placeholerContent=""){
    let div = document.createElement("div")
    div.className = "translation-item"

    let input = document.createElement("input")
    input.type = "text"
    input.className = "editable"
    input.value = translation
    input.placeholder = placeholerContent
    input.addEventListener("input", ()=>{
        showSaveAndHideDelete(true)
    })

    let buttonRemove = document.createElement("button")
    buttonRemove.className = "btn-remove"
    buttonRemove.textContent = "×"
    buttonRemove.addEventListener("click", ()=>{
        div.remove()
        showSaveAndHideDelete(true)
    })

    div.appendChild(input)
    div.appendChild(buttonRemove)
    return div
}


function htmlTrToObjectWord(tr){
    let word = new Word()
    let inputEnglish = tr.querySelector("td.english > input")
    if(inputEnglish){
        word.english = inputEnglish.value
    }else{
        word.english = ""
    }

    let translations = tr.querySelectorAll("td.translations > div.translation-item > input") 
    for(let translation of translations){
        if(translation){
            word.french.push(translation.value)
        }else{
            word.french.push("")
        }
    }

    let exampleItems = tr.querySelectorAll("td.examples > div.example-item")
    for(let exampleItem of exampleItems){
        if(exampleItem){
            let textAreaEnglish = exampleItem.querySelector(".englishExample")
            let textAreaFrench = exampleItem.querySelector(".frenchExample")

            let englishExample = ""
            if(textAreaEnglish){
                englishExample = textAreaEnglish.value
            }

            let frenchExample = ""
            if(textAreaFrench){
                frenchExample = textAreaFrench.value
            }

            let example = new Example(englishExample, frenchExample)
            word.examples.push(example)
        }
    }
    return word
}


async function askServerToEditWord(oldNameWord, newWord){
    
    let data = {"oldNameWord":oldNameWord, "newWord":newWord, "listName":currentList.name}
    ipcRenderer.send("edit-word", data)

    let response = await new Promise((resolve)=>{
        ipcRenderer.once('response-edit-word', (event, data) => {
            resolve(data)
        });
    })
    return response
}

async function askServerToRemoveWord(wordName){
    let data = {"wordName":wordName, "listName":currentList.name}
    ipcRenderer.send("remove-word", data)

    let response = await new Promise((resolve)=>{
        ipcRenderer.once('response-remove-word', (event, data) => {
            resolve(data)
        });
    })
    return response
}

function askServerToAddWord(word){
    return true
}

function getListToEdit(){
    return "testaze"
}