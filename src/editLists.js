const { ipcRenderer } = require('electron');
var listNames = null;
var groups = null;

document.addEventListener("DOMContentLoaded", (event) => {

    ipcRenderer.send("ask-data", "file-list")
    ipcRenderer.send("ask-data", "groups")

    ipcRenderer.on('response-file-list', (event, data) => {
        for (let file_name of data) {
            file_name = file_name.replace(".json", "")
        }
        listNames = data
        checkAndUpdate()
    });

    ipcRenderer.on('response-groups', (event, data) =>{
        groups = JSON.parse(data)
        console.log(groups)
        checkAndUpdate()
    });

})

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

function createLine(name, groups){
    document.getElementById("file_list_table_tbody")
    document.createElement("tr")
    
}