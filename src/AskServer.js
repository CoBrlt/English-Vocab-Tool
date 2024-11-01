const { ipcRenderer } = require('electron');
const NotificationManager = require("./NotificationManager.js")
var notifier = new NotificationManager()

class AskServer{

    static async askServerToChangeListName(oldName, newName) {
        let data = { "oldName": oldName, "newName": newName };
        ipcRenderer.send("change-list-name", data);

        // Attendre la réponse avec une promesse simplifiée
        const response = await new Promise((resolve) => {
            ipcRenderer.once('response-change-list-name', (event, data) => {
                resolve(data);
            });
        });

        return handleResponse(response);
    }

    static async askServerToCopyList(listNameToCopy){
        
        ipcRenderer.send("copy-list", listNameToCopy)

        let response = await new Promise((resolve)=>{
            ipcRenderer.once('response-copy-list', (event, data) => {
                resolve(data)
            });
        })
        return handleResponse(response)
    }

    static async askServerToRemoveList(listNameToRemove){
        ipcRenderer.send("remove-list", listNameToRemove)

        let response = await new Promise((resolve)=>{
            ipcRenderer.on('response-remove-list', (event, data) => {
                resolve(data)
            });
        })
        return handleResponse(response)
        // return true
    }

    static async askServerToAddNewList(name){
        ipcRenderer.send("add-list", name)

        let response = await new Promise((resolve)=>{
            ipcRenderer.on('response-add-list', (event, data) => {
                resolve(data)
            });
        })
        return handleResponse(response)
        // return true
    }

    static async askServerToAddNewGroup(name){
        ipcRenderer.send("add-group", name)

        let response = await new Promise((resolve)=>{
            ipcRenderer.on('response-add-group', (event, data) => {
                resolve(data)
            });
        })
        return handleResponse(response)
        // return true
    }

    static async askServerToEditGroupsForListName(listConcernedByPopGroups, listGroupsToAdd){
        let data = {"listName":listConcernedByPopGroups, "listGroups":listGroupsToAdd}
        ipcRenderer.send("change-list-name-groups", data)

        let response = await new Promise((resolve)=>{
            ipcRenderer.on('response-change-list-name-groups', (event, data) => {
                resolve(data)
            });
        })
        return  handleResponse(response)
    }


    static async askServerToRemoveGroup(groupName){
        ipcRenderer.send("remove-group", groupName)

        let response = await new Promise((resolve)=>{
            ipcRenderer.on('response-remove-group', (event, data) => {
                resolve(data)
            });
        })
        return  handleResponse(response)
    }

    static async askServerToGetGroupsForOneList(listName){
        ipcRenderer.send("get-groups-for-one-list", listName)
        console.log("envoye")

        let response = await new Promise((resolve)=>{
            ipcRenderer.on('response-get-groups-for-one-list', (event, data) => {
                resolve(data)
            });
        })
        return  handleResponse(response)
    }

    static async askServerToEditWord(oldNameWord, newWord){
    
        let data = {"oldNameWord":oldNameWord, "newWord":newWord, "listName":currentList.name}
        ipcRenderer.send("edit-word", data)
    
        let response = await new Promise((resolve)=>{
            ipcRenderer.once('response-edit-word', (event, data) => {
                resolve(data)
            });
        })
        return handleResponse(response)
    }
    
    static async askServerToRemoveWord(wordName){
        let data = {"wordName":wordName, "listName":currentList.name}
        ipcRenderer.send("remove-word", data)
    
        let response = await new Promise((resolve)=>{
            ipcRenderer.once('response-remove-word', (event, data) => {
                resolve(data)
            });
        })
        return handleResponse(response)
    }
    
    static async askServerToAddWord(word){
        let data = {"wordData":word, "listName":currentList.name}
        ipcRenderer.send("add-word", data)
    
        let response = await new Promise((resolve)=>{
            ipcRenderer.once('response-add-word', (event, data) => {
                resolve(data)
            });
        })
        return handleResponse(response)
    }

    static async askServerToGetGroups(){
        let data = "groups"
        ipcRenderer.send("get-data", data)
    
        let response = await new Promise((resolve)=>{
            ipcRenderer.once('response-groups', (event, data) => {
                resolve(data)
            });
        })
        return handleResponse(response)
    }

    static async askServerToGetListNames(){
        let data = "list-names"
        ipcRenderer.send("get-data", data)
    
        let response = await new Promise((resolve)=>{
            ipcRenderer.once('response-list-names', (event, data) => {
                resolve(data)
            });
        })
        return handleResponse(response)
    }

    static async askServerToGetListContent(listName){
        ipcRenderer.send("get-content-file", listName)
    
        let response = await new Promise((resolve)=>{
            ipcRenderer.once('response-content-file', (event, data) => {
                resolve(data)
            });
        })
        return handleResponse(response)
    }

    static async askServerToGetListsInGroup(groupName){
        ipcRenderer.send("get-lists-in-group", groupName)
    
        let response = await new Promise((resolve)=>{
            ipcRenderer.once('response-get-lists-in-group', (event, data) => {
                resolve(data)
            });
        })

        return handleResponse(response)
    }

}

function handleResponse(response){
    if(response.notify){
        let typeNotif = null 
        if(response.success){
            typeNotif = "success"
        }else{
            typeNotif = "error"
        }
        notifier.show(response.message, typeNotif)
    }
    return response.data
}

module.exports = AskServer;