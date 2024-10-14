const { ipcRenderer } = require('electron');
var listNames = null;
var groups = null;
var checkboxCounter = 0;
var listConcernedByPopGroups = null

document.addEventListener("DOMContentLoaded", (event) => {

    ipcRenderer.send("ask-data", "file-list")
    ipcRenderer.send("ask-data", "groups")

    ipcRenderer.on('response-file-list', (event, data) => {
        for (let i = 0; i<data.length; i++) {
            data[i] = data[i].replace(".json", "")
        }
        listNames = data
        checkAndUpdate()
    });

    ipcRenderer.on('response-groups', (event, data) =>{
        groups = JSON.parse(data)
        console.log(groups)
        checkAndUpdate()
    });

    handleAddList()
    handleGroups()

})

function handleGroups(){
    let popup = document.getElementById("popup")
    popup.addEventListener("click", (event)=>{
        if(event.target === event.currentTarget){
            popup.style.display = "none"
        }
    })

    let buttonConfirmPopup = document.getElementById("button_confirm_popup")
    buttonConfirmPopup.addEventListener("click", ()=>{
        popup.style.display = "none"
    })

    let buttonAddGroup = document.getElementById("button_add_group")
    buttonAddGroup.addEventListener("click", ()=>{
        let input = document.getElementById("input_add_group")
        newGroupName = input.value
        if(askServerToAddNewGroup(newGroupName)){
            input.value = ""
            groups[newGroupName] = []
            createLineGroup(newGroupName)
        }
        
    })
}

function getAllGroups(){
    return Object.keys(groups)
}

function createAllLinesGroup(groupsToCheck){
    for(let group of getAllGroups()){
        createLineGroup(group, groupsToCheck.includes(group))
    }
}

function removeAllLinesGroup(){
    let allCheckboxs = document.querySelectorAll(".tr_checkbox_group")
    allCheckboxs.forEach(element => element.remove());
}

function createLineGroup(groupName, checked=false){
    let table = document.getElementById("table_popup")

    let newTr = document.createElement("tr")
    newTr.className = "tr_checkbox_group"

    let newCheckbox = document.createElement("input")
    newCheckbox.type = "checkbox"
    newCheckbox.id = "checkbox" + checkboxCounter.toString()
    newCheckbox.checked = checked

    let newLabel = document.createElement("label")
    newLabel.htmlFor = "checkbox" + checkboxCounter.toString()

    let tdCheckbox = document.createElement("td")
    tdCheckbox.appendChild(newCheckbox)
    tdCheckbox.appendChild(newLabel)

    let tdGroupName = document.createElement("td")
    tdGroupName.textContent = groupName

    newTr.appendChild(tdCheckbox)
    newTr.appendChild(tdGroupName)

    table.appendChild(newTr)

    checkboxCounter++

}

function handleAddList(){
    let input = document.getElementById("input_list_name_add")
    let button = document.getElementById("button_Add_list")
    button.addEventListener('click', ()=>{
        let newName = input.value
        input.value = ""
        if(askServerToAddNewList(newName)){
            createLine(newName, [])
        }
    })
}

function getGroupsOfListByName(name){
    listGroups = []
    for(let groupName in groups){
        for(let nameInGroup of groups[groupName]){
            if(nameInGroup == name){
                listGroups.push(groupName)
            }
        }
    }
    return listGroups
}

function checkAndUpdate(){
    if(listNames && groups){
        for(let name of listNames){
            createLine(name, getGroupsOfListByName(name))
        }
    }
}

function createLine(name, groupsForName){
    let tbody = document.getElementById("file_list_table_body")
    
    let newTr = document.createElement("tr")
    newTr.id = name


    let tdName = document.createElement("td")
    let spanName = document.createElement("span")
    spanName.textContent = name

    let inputName = document.createElement("input")
    inputName.type = "text"
    inputName.value = name
    inputName.style.display = "none"

    tdName.append(inputName, spanName)

    let tdGroups = document.createElement("td")
    for(let group of groupsForName){
        let spanGroupName = document.createElement("span")
        spanGroupName.textContent = group
        tdGroups.append(spanGroupName)
    }

    let tdEdit = document.createElement("td")
    let confirm = createButton("Confirm")
    confirm.style.display = "none"
    let edit = createButton("Edit")
    tdEdit.append(confirm, edit)
    
    confirm.addEventListener("click", () => {
        confirm.style.display = "none"
        edit.style.display = "inline"
        inputName.style.display = "none"
        spanName.textContent = inputName.value
        newTr.id = inputName.value
        if(name != inputName){
            askServerToChangeName(name, inputName.value)
        }
    })

    edit.addEventListener("click", ()=>{
        edit.style.display = "none"
        confirm.style.display = "inline"
        inputName.style.display = "inline-block"
        spanName.textContent = ""
    })

    let tdCopy = document.createElement("td")
    let copyButton = createButton("Copy")
    copyButton.addEventListener("click", ()=>{
        let newListName = askServerToCopyList(spanName.textContent)
        createLine(newListName, getGroupsOfListByName(newListName))
    })
    tdCopy.append(copyButton)


    let tdDelete = document.createElement("td")
    let deleteButton = createButton("Delete")
    deleteButton.addEventListener("click", ()=>{
        if(askServerToRemoveList(name)){
            newTr.remove()
        }
    })
    tdDelete.append(deleteButton)


    let tdGroupsButton = document.createElement("td")
    let groupsButton = createButton("Groups")
    groupsButton.addEventListener("click", ()=>{
        removeAllLinesGroup()
        let popup = document.getElementById("popup")
        popup.style.display = "flex"
        createAllLinesGroup(groupsForName)
        let popup_checkbox = document.getElementById("popup_checkbox")
        popup_checkbox.scrollTop = 0
        listConcernedByPopGroups = spanName.textContent
    })
    tdGroupsButton.append(groupsButton)


    newTr.appendChild(tdName);
    newTr.appendChild(tdGroups);
    newTr.appendChild(tdEdit);
    newTr.appendChild(tdGroupsButton)
    newTr.appendChild(tdCopy)
    newTr.appendChild(tdDelete)

    tbody.appendChild(newTr)
}

function createButtonInLine(buttonName){
    let td = document.createElement("td")
    let button = createButton(buttonName)
    td.append(button)
    return td
}

function createButton(buttonName){
    let button = document.createElement("button")
    button.textContent = buttonName
    button.className = "button button_" + buttonName
    return button
}

function askServerToChangeName(oldName, newName){
    console.log("chaaannngeeement !!!")
}

function askServerToCopyList(listNameToCopy){
    return listNameToCopy + " - Copy"
}

function askServerToRemoveList(listNameToRemove){
    return true
}

function askServerToAddNewList(name){
    return true
}

function askServerToAddNewGroup(name){
    return true
}