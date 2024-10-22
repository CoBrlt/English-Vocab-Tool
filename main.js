const { app, BrowserWindow, screen} = require('electron')
const { ipcMain } = require("electron")
const fs = require('fs');
const path = require('path');
const List = require("./src/List.js");
const Word = require("./src/Word.js")
const Example = require('./src/Example.js');

const path_folder_vocab = "./jsonData"


const createWindow = () => {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
        webPreferences:{
        nodeIntegration: true,
        contextIsolation: false 
      }
    })
    // win.maximize();
    win.loadFile('./src/editWords.html')
}

function getListFiles(){
    let fichiers = fs.readdirSync(path_folder_vocab)
    return fichiers
}

function readFile(path){
    try{
        const data = fs.readFileSync(path, "utf8")
        return data
    }catch(err){
        console.error("Error trying read file")
        return false
    }
}

function copyFile(fileNameSrc, fileNameDest){
    pathSrc = fileNameToPath(fileNameSrc)
    pathDest = fileNameToPath(fileNameDest)
    
    let response = fileNameDest
    
    fs.copyFile(pathSrc, pathDest, (err) => {
        if (err) {
            console.error('Error copying the file:', err);
            response = false
        }
    });
    return response
}

function writeFile(path, content){
    let success = true

    fs.writeFile(path, content, (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture dans le fichier:', err);
            success = false
        }
    })
    return success
}

function removeFile(fileName){
    const path = fileNameToPath(fileName)
    
    let success = true

    fs.unlink(path, (err) => {
        if (err) {
            console.error('Error deleting the file:', err);
            success = false
        }
    })

    return success
}

function fileNameToPath(fileName){
    return path_folder_vocab+ "/" + fileName + ".json"
}

function renameFile(oldName, newName){
    oldName = fileNameToPath(oldName)
    newName = fileNameToPath(newName)

    let success = true

    fs.rename(oldName, newName, (err) => {
        if (err) {
            console.error('Erreur lors du renommage du fichier:', err);
            success = false
        }
    })
    
    return success

}

function getObjectListFromFile(listName){
    let listString = readFile(fileNameToPath(listName))
    let list = new List() 
    list.fromJson(listString)
    return list
}


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})


ipcMain.on('ask-data', (event, data) => {
    // console.log('Données reçues du front :', data);
    let response
    if(data == "file-list"){
        response = getListFiles();
        event.sender.send('response-file-list', response);
    }else if(data == "groups"){
        response = readFile("./groupsData.json");
        event.sender.send("response-groups", response)
    }
});

ipcMain.on("ask-content-file", (event, data) =>{
    const response = readFile(path_folder_vocab + "/" + data + ".json")
    event.sender.send("response-content-file", response)
})

ipcMain.on("change-list-name", (event, data)=>{
    const response = renameFile(data["oldName"], data["newName"])
    event.sender.send("response-change-list-name", response)
})

ipcMain.on("copy-list", (event, data)=>{
    let copyName = data + " - Copy"
    const response = copyFile(data, copyName)
    if(response){
        let copiedList = getObjectListFromFile(copyName)
        copiedList.setName(copyName)        
    }
    event.sender.send("response-copy-list", response)
})

ipcMain.on("remove-list", (event, data)=>{
    const response = removeFile(data)
    event.sender.send("response-remove-list", response)
})

ipcMain.on("add-list", (event, data)=>{
    const path = fileNameToPath(data)
    content = {
        "name":data,
        "words":[],
        "groups":[]
    }
    const response = writeFile(path, JSON.stringify(content, null, 4))
    event.sender.send("response-add-list", response)
})

ipcMain.on("add-group", (event, data)=>{
    let response = false
    let groupsData = readFile("./groupsData.json")
    if(groupsData){
        groupsData = JSON.parse(groupsData)
        groupsData[data] = []
        groupsData = JSON.stringify(groupsData, null, 4)
        writeFile("./groupsData.json", groupsData)
        response = true
    }
    event.sender.send("response-add-group", response)
})


ipcMain.on("change-list-name-groups", (event, data)=>{
    let response = false
    listName = data["listName"]
    listGroups = data["listGroups"]
    let groupsData = readFile("./groupsData.json")
    if(groupsData){
        groupsData = JSON.parse(groupsData)

        for(group in groupsData){
            if(listGroups.includes(group) && !groupsData[group].includes(listName)){
                groupsData[group].push(listName)
            }
        }
        
        response = groupsData
        groupsData = JSON.stringify(groupsData, null, 4)
        if(!writeFile("./groupsData.json", groupsData)){
            response = false
        }
    }
    event.sender.send("response-change-list-name-groups", response)
})

ipcMain.on("remove-group", (event, data)=>{
    let response = false
    let groupsData = readFile("./groupsData.json")
    if(groupsData){
        groupsData = JSON.parse(groupsData)
        delete groupsData[data]
        console.log(groupsData)
        groupsData = JSON.stringify(groupsData, null, 4)
        writeFile("./groupsData.json", groupsData)
        response = true
    }
    event.sender.send("response-remove-group", response)
})

ipcMain.on("edit-word", (event, data)=>{
    let oldNameWord = data["oldNameWord"]
    let newWord = data["newWord"]
    let listName = data["listName"]

    let list = getObjectListFromFile(listName)    
    if(list.setWordByName(oldNameWord, newWord)){
        let stringList = JSON.stringify(list, null, 4)
        if(writeFile(fileNameToPath(listName), stringList)){
            response = true
        }else{
            response = false
        }
    }else{
        response = false
    }
    event.sender.send("response-edit-word", response)
})

ipcMain.on("remove-word", (event, data)=>{
    let wordName = data["wordName"]
    let listName = data["listName"]
    console.log(wordName)

    let list = getObjectListFromFile(listName)    
    if(list.removeWordByName(wordName)){
        let stringList = JSON.stringify(list, null, 4)
        if(writeFile(fileNameToPath(listName), stringList)){
            response = true
        }else{
            response = false
        }
    }else{
        response = false
    }
    event.sender.send("response-remove-word", response)
})