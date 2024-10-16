const { app, BrowserWindow, screen} = require('electron')
const { ipcMain } = require("electron")
const fs = require('fs');
const path = require('path');

const path_folder_vocab = "./jsonData"


const createWindow = () => {
    const win = new BrowserWindow({
      width: 600,
      height: 600,
        webPreferences:{
        nodeIntegration: true,
        contextIsolation: false 
      }
    })
    // win.maximize();
    win.loadFile('./src/home.html')
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
        return "{}"
    }
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
        }
    })
    
    return success

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
    console.log(data)
    const response = renameFile(data["oldName"], data["newName"])
    event.sender.send("response-change-list-name", response)
})

ipcMain.on("")