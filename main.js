const { app, BrowserWindow, screen} = require('electron')
const { ipcMain } = require("electron")
const fs = require('fs');
const path = require('path');
const List = require("./src/List.js");
const Word = require("./src/Word.js")
const Example = require('./src/Example.js');
const Response = require("./src/Response.js")
const response = new Response()

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
    win.loadFile('./src/home.html')
}

function getListFiles(path=true){
    try{
        let fichiers = fs.readdirSync(path_folder_vocab)
        if(!path){
            for(let i = 0; i<fichiers.length;i++){
                fichiers[i] = fichiers[i].replace(".json", "")
            }
        }
        return fichiers
    }catch(err){
        console.error("Error reading Diretory : ", err)
        return false
    }
}

function readFile(path){
    try{
        const data = fs.readFileSync(path, "utf8")
        return data
    }catch(err){
        console.error("Error trying read file : ", err)
        return false
    }
}

function copyFile(fileNameSrc, fileNameDest){
    pathSrc = fileNameToPath(fileNameSrc)
    pathDest = fileNameToPath(fileNameDest)
    
    let response = fileNameDest
    try{

        fs.copyFileSync(pathSrc, pathDest)
        return response
    }catch(err){
        console.error('Error copying the file:', err);
        // response = false
        return false
    }
}

function writeFile(path, content){
    let success = true

    try{
        let data = fs.writeFileSync(path, content)
        return success
    }catch(err){
        console.log("Error during writing file : ", err)
        return false
    }
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

    try{
        fs.renameSync(oldName, newName)
        return true
    }catch(err){
        console.error('Erreur lors du renommage du fichier:', err);
        return false
    }
}

function getObjectListFromFile(listName){
    try{
        let listString = readFile(fileNameToPath(listName))
        let list = new List() 
        list.fromJson(listString)
        return list
    }catch(err){
        return false
    }
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


ipcMain.on('get-data', (event, data) => {
    // console.log('Données reçues du front :', data);
    let dataToSend
    if(data == "list-names"){
        dataToSend = getListFiles()
        if(dataToSend){
            response.set(dataToSend, true, "Lists got successfuly")
        }else{
            response.set(false, false, "Error while getting lists")    
        }
        event.sender.send('response-list-names', response);
    }else if(data == "groups"){
        dataToSend = readFile("./groupsData.json");
        if(dataToSend){
            response.set(dataToSend, true, "Groups got successfuly")
        }else{
            response.set(false, false, "Error while getting groups")    
        }
        event.sender.send("response-groups", response)
    }
});

ipcMain.on("get-content-file", (event, data) =>{
    let dataToSend = readFile(path_folder_vocab + "/" + data + ".json")
    if(dataToSend){
        response.set(data, true, "content file got successfuly")
    }else{
        response.set(false, false, "Error while getting content file")    
    }
    event.sender.send("response-content-file", response)
})

ipcMain.on("change-list-name", (event, data)=>{
    let listLists = getListFiles()
    if(listLists){
        if(!listLists.includes(data["newName"])){
            try{
                if(renameFile(data["oldName"], data["newName"])){
                    let listRenamed = getObjectListFromFile(data["newName"])
                    listRenamed.setName(data["newName"])
                    if(writeFile(fileNameToPath(data["newName"]), JSON.stringify(listRenamed, null, 4))){
                        response.set(true, true, "List name successfuly changed")
                    }else{
                        response.set(false, false, "Error while changing list name")
                    }
                }else{
                    response.set(false, false, "Error while changing list name")
                }
            }catch(err){
                response.set(false, false, "Error while changing list name")
            }
        }else{
            response.set(false, false, "Can't change name because a list named "+data["newName"]+" already exists")
        }
    }else{
        response.set(false, false, "Error while changing list name")
    }
    event.sender.send("response-change-list-name", response)
})

ipcMain.on("copy-list", (event, data)=>{
    let copyName = data + " - Copy"
    let listLists = getListFiles()
    if(!listLists.includes(copyName)){
        if(copyFile(data, copyName)){
            try{
                let copiedList = null
                if(response){
                    copiedList = getObjectListFromFile(copyName)
                    copiedList.setName(copyName)        
                }
                writeFile(fileNameToPath(copyName), JSON.stringify(copiedList, null, 4))
                response.set(copyName, true, "List successfuly copied")
            }catch(err){
                response.set(false, false, "Error while copying the list")
            }
        }else{
            response.set(false, false, "Error while copying the list")
        }
    }else{
        response.set(false, false, "Can't copy the list because list "+ copyName +" already exists")
    }
    event.sender.send("response-copy-list", response)
})

ipcMain.on("remove-list", (event, data)=>{
    if(removeFile(data)){
        let listName = data
        let groupsData = readFile("./groupsData.json")
        if(groupsData){
            try{
                groupsData = JSON.parse(groupsData)
        
                for(let group in groupsData){
        
                    if(groupsData[group].includes(listName)){
                        let index = groupsData[group].indexOf(listName);
                        if (index !== -1) {
                            groupsData[group].splice(index, 1);
                        }
                    }
                }
                
                groupsData = JSON.stringify(groupsData, null, 4)
                if(writeFile("./groupsData.json", groupsData)){
                    response.set(true, true, "List successfuly removed")
                }else{
                    response.set(false, false, "Error while removing list")
                }
            }catch(err){
                response.set(false, false, "Error while removing list")
            }
        }
    }
    


    event.sender.send("response-remove-list", response)
})

ipcMain.on("add-list", (event, data)=>{
    const path = fileNameToPath(data)
    content = {
        "name":data,
        "words":[],
        "groups":[]
    }

    let listLists = getListFiles()
    try{
        if(listLists){
            if(listLists.includes(data)){
                if(writeFile(path, JSON.stringify(content, null, 4))){
                    response.set(true, true, "List successfuly added")
                }else{
                    response.set(false, false, "Error while adding list")
                }
            }else{
                response.set(false, false, "Error, list name given already exists")
            }
        }else{
            response.set(false, false, "Error while adding list")
        }
    }catch(err){
        response.set(false, false, "Error while adding list")
    }
    
    
    event.sender.send("response-add-list", response)
})

ipcMain.on("add-group", (event, data)=>{
    let groupsData = readFile("./groupsData.json")
    if(groupsData){
        groupsData = JSON.parse(groupsData)
        if(!data in groupsData){
            try{
                groupsData[data] = []
                groupsData = JSON.stringify(groupsData, null, 4)
            }catch(err){
                response.set(false, false, "Error while adding group")
            }
        }else{
            response.set(false, false, "Error, group already exist")
        }
        if(writeFile("./groupsData.json", groupsData)){
            response.set(true, true, "Groups successfuly added")
        }else{
            response.set(false, false, "Error while adding group")
        }
    }else{
        response.set(false, false, "Error while adding group")
    }
    event.sender.send("response-add-group", response)
})


ipcMain.on("change-list-name-groups", (event, data)=>{
    listName = data["listName"]
    listGroups = data["listGroups"]
    let groupsData = readFile("./groupsData.json")
    if(groupsData){
        try{
            groupsData = JSON.parse(groupsData)

            for(let group in groupsData){
                if(listGroups.includes(group) && !groupsData[group].includes(listName)){
                    groupsData[group].push(listName)
                }
                if(groupsData[group].includes(listName) && !listGroups.includes(group)){
                    let index = groupsData[group].indexOf(listName);
                    if (index !== -1) {
                        groupsData[group].splice(index, 1);
                    }
                }
            }
            
            response = groupsData
            groupsData = JSON.stringify(groupsData, null, 4)
            if(!writeFile("./groupsData.json", groupsData)){
                response.set(true, true, "Successfuly editing groups")
            }else{
                response.set(false, false, "Error while editing groups")
            }
        }catch(err){
            response.set(false, false, "Error while editing groups")
        }
        
    }else{
        response.set(false, false, "Error while editing groups")
    }
    event.sender.send("response-change-list-name-groups", response)
})

ipcMain.on("remove-group", (event, data)=>{
    let groupsData = readFile("./groupsData.json")
    if(groupsData){
        groupsData = JSON.parse(groupsData)
        if(data in groupsData){
            try{
                delete groupsData[data]
                groupsData = JSON.stringify(groupsData, null, 4)
                writeFile("./groupsData.json", groupsData)
                response.set(true, true, "Group successfuly removed")
            }catch(err){
                response.set(false, false, "Error while removing the group")
            }
        }else{
            response.set(false, false, "Group to remove not found")
        }
    }else{
        response.set(false, false, "Error while removing the group")
    }
    event.sender.send("response-remove-group", response)
})

ipcMain.on("edit-word", (event, data)=>{
    let oldNameWord = data["oldNameWord"]
    let newWord = data["newWord"]
    let listName = data["listName"]

    let list = getObjectListFromFile(listName) 
    if(list){
        if(list.setWordByName(oldNameWord, newWord)){
            let stringList = JSON.stringify(list, null, 4)
            if(writeFile(fileNameToPath(listName), stringList)){
                response.set(true, true, "Word successfuly edited")
            }else{
                response.set(false, false, "Error while editing the word")
            }
        }else{
            response.set(false, false, "Error word not foud")
        }
    }else{
        response.set(false, false, "Error while editing the word")
    }
    event.sender.send("response-edit-word", response)
})

ipcMain.on("remove-word", (event, data)=>{
    let wordName = data["wordName"]
    let listName = data["listName"]
    // console.log(wordName)

    let list = getObjectListFromFile(listName)  
    if(list){
        if(list.removeWordByName(wordName)){
            let stringList = JSON.stringify(list, null, 4)
            if(writeFile(fileNameToPath(listName), stringList)){
                response.set(true, true, "Word successfuly removed")
            }else{
                response.set(false, false, "Error while removing the word")
            }
        }else{
            response.set(false, false, "Error word not found")
        }
    }else{
        response.set(false, false, "Error while removing the word")
    }
    event.sender.send("response-remove-word", response)
})

ipcMain.on("add-word", (event, data)=>{
    let wordData = data["wordData"]
    let listName = data["listName"]
    
    let list = getObjectListFromFile(listName)    
    if(list){
        if(!list.checkIfWordExist(wordData.english)){
            if(list.addWord(wordData)){
                let stringList = JSON.stringify(list, null, 4)
                if(writeFile(fileNameToPath(listName), stringList)){
                    response.set(true, true, "Word added", true)
                }else{
                    response.set(false, false, "Error while adding the word", true)
                }
            }else{
                response.set(false, false, "Error while adding the word", true)
            }
        }else{
            response.set(false, false, "Can't add word already exist", true)
        }
    }else{
        response.set(false, false, "Error while adding the word")
    }   
    event.sender.send("response-add-word", response)
})

ipcMain.on("get-groups-for-one-list", (event, data)=>{
    let listGroups = []
    let listName = data

    let groupsData = readFile("./groupsData.json")
    if(groupsData){
        try{
            groupsData = JSON.parse(groupsData)
            for(let group in groupsData){
                if(groupsData[group].includes(listName)){
                    listGroups.push(group)
                }
            }
            response.set(listGroups, true, "Success getting groups for one list", false)
        }catch(err){
            response.set(false,  false, "Error parsing JSON group data", true)
        }

    }else{
        response.set(false, false, "Error reading file", true)
    }
    event.sender.send("response-get-groups-for-one-list", response)
})

ipcMain.on("get-lists-in-group", (event, data)=>{
    let groupName = data
    let groupsData = readFile("./groupsData.json")
    if(groupsData){
        try{
            groupsData = JSON.parse(groupsData)
            if(groupName in groupsData){
                response.set(groupsData[groupName], true, "Success", false)
            }else{
                response.set(false, false, "Group name : " + groupName + " not found", true)
            }
        }catch(err){
            response.set(false,  false, "Error parsing JSON group data")
        }
        
    }else{
        response.set(false, false, "Error reading file", true)
    }
    event.sender.send("response-get-lists-in-group", response)
})