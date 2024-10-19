const { ipcRenderer } = require('electron');
const List = require("./List.js");
const Example = require('./Example.js');
var currentList = null;


document.addEventListener("DOMContentLoaded", (event) => {

    let listToEdit = getListToEdit()
    document.getElementById("title_table").textContent = "List Name : " + listToEdit

    ipcRenderer.send("ask-content-file", listToEdit)

    ipcRenderer.on('response-content-file', (event, data) => {
        currentList = new List()
        currentList.fromJson(data)
        console.log(currentList)
        handleLineAdd()
        createAllLines()
    });
})

function handleLineAdd(){
    let btnAddWord = document.getElementById("btn-add-word")
    btnAddWord.addEventListener("click", ()=>{
        let tr = document.getElementById("tr-add-word")
        let word = htmlTrToObjectWord(tr)
        // askServerToAdd
    })
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
    
    let tdDelete = document.createElement("td")
    let buttonDelete = document.createElement("button")
    buttonDelete.className = "button"
    buttonDelete.textContent = "Delete"
    buttonDelete.addEventListener("click", ()=>{
        let word = null
        if(askServerToRemoveWord(word)){
            newTr.remove()
        }
    })
    tdDelete.append(buttonDelete)


    let tdSave = document.createElement("td")
    let buttonSave = document.createElement("button")
    buttonSave.className = "button"
    buttonSave.textContent = "Save"
    buttonSave.style.display = "none"
    buttonSave.addEventListener("click", ()=>{
        let word = htmlTrToObjectWord(newTr)
        if(askServerToSaveWord(word)){
            buttonSave.style.display = "none"
            buttonDelete.style.display = "inline-block"
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
        let div = createInputTranslation(showSaveAndHideDelete, translation)
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

    let createTextArea = (content, placeholder="")=>{
        let textArea = document.createElement("textarea")
        textArea.className = "editable"
        textArea.textContent = content
        textArea.placeholder = placeholder
        textArea.addEventListener("input", ()=>{
            showSaveAndHideDelete(true)
        })
        return textArea
    }  
    
    let englishTextArea = createTextArea(example.getEnglish(), "Enter English Exemple")
    let frenchTextArea = createTextArea(example.getFrench(), "Enter example translation")

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
    return null
}


function askServerToSaveWord(word){
    return true
}

function askServerToRemoveWord(word){
    return true
}


function getListToEdit(){
    return "all"
}