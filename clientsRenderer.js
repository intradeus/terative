//IMPORTS
const Store = require('electron-store');
const store = new Store();
window.$ = window.jQuery = require('jquery');
const { remote } = require('electron')
const prompt = require('electron-prompt');
const localization = require('./js/translation/localization.js');
const general = require("./js/general-functions.js");

//VARIABLES
var CACHE_CLIENT = store.get("cachedClients");
var LANG = store.get("lang") === undefined ? "fr_FR" : store.get("lang");

//INITIAL FUNCTIONS
localization.setLocaleText("clients");
general.assignDarkTheme();
assignFunctionToButtons();
setCachedClients("");

//FUNCTIONS
function setCachedClients(filter){
    var divClients = document.getElementById("cachedClientsList");
    var clientCount = 0;
    var filterNormalized = filter.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    CACHE_CLIENT.forEach(client => {
        var clientNameNormalized = client.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if(clientNameNormalized.includes(filterNormalized)){
            var divClientInfo = document.createElement("div");
            var inputName = document.createElement("input");
            var inputEmail = document.createElement("input");
            var editButton = document.createElement("button");
            var edit = document.createElement("i");
            var trashButton = document.createElement("button");
            var trash = document.createElement("i");
            var saveButton = document.createElement("button");
            var save = document.createElement("i");
            var classAppendEdit = document.createElement("div");
            var classAppendTrash = document.createElement("div");

            divClientInfo.className = "input-group mb-3"
            divClientInfo.id = client.id;

            inputName.type = "text";
            inputName.className = "form-control";
            inputName.id = "input-name-" + client.id;
            inputName.placeholder = "Nom Complet";
            inputName.readOnly = true;
            inputName.value = client.name;
        
            inputEmail.type = "text";
            inputEmail.className = "form-control";
            inputEmail.id = "input-email-" + client.id;
            inputEmail.placeholder = "Email";
            inputEmail.readOnly = true;
            inputEmail.value = client.email

            trash.className = "fa fa-trash"
            edit.className = "fa fa-edit"
            save.className = "fa fa-save"

            classAppendEdit.className = "input-group-append";
            classAppendTrash.className = "input-group-append";

            editButton.className = "btn btn-outline-primary";
            editButton.id = "edit-" + client.id;
            editButton.onclick = function() {editClient(client.id);}
            editButton.type = "button"

            trashButton.className = "btn btn-outline-secondary hidden"
            trashButton.id = "delete-" + client.id;
            trashButton.onclick = function() { deleteClient(client.id); this.parentNode.parentNode.remove()}
            trashButton.type = "button"

            saveButton.className = "btn btn-outline-success hidden"
            saveButton.id = "save-" + client.id;
            saveButton.onclick = function() { saveClients(client.id); }
            saveButton.type = "button"

            trashButton.appendChild(trash);
            editButton.appendChild(edit);
            saveButton.appendChild(save);

            divClientInfo.appendChild(inputName);
            divClientInfo.appendChild(inputEmail);
            classAppendEdit.appendChild(editButton);
            classAppendEdit.appendChild(saveButton);
            classAppendTrash.appendChild(trashButton);

            divClientInfo.appendChild(classAppendTrash);
            divClientInfo.appendChild(classAppendEdit);
            divClients.appendChild(divClientInfo);
            clientCount++;
        }
   });
   document.getElementById("clientCount").innerHTML = clientCount;
}

function editClient(id) {
   general.hideElement("edit-"+id);
   general.showElement("save-"+id);
   general.showElement("delete-"+id);
   document.getElementById("input-name-"+id).readOnly = false;
   document.getElementById("input-email-"+id).readOnly = false;
}

function saveClients(id) {
    general.showElement("edit-"+id);
    general.hideElement("save-"+id);
    general.hideElement("delete-"+id);
    var inputName = document.getElementById("input-name-"+id);
    var inputEmail = document.getElementById("input-email-"+id);
    inputName.readOnly = true;
    inputEmail.readOnly = true;

    CACHE_CLIENT.forEach(client => {
        if(client.id == id){
            client.name = inputName.value;
            client.email = inputEmail.value;
        }
    })

    store.set('cachedClients', CACHE_CLIENT);
}

function deleteClient(id) {

    var index = CACHE_CLIENT.findIndex(x => x.id === id);
    CACHE_CLIENT.splice(index, 1);
    store.set('cachedClients', CACHE_CLIENT);

}

function filterClientSearch(){
    var filter = document.querySelector("#searchClient").value;

    const myNode = document.getElementById("cachedClientsList");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }

    setCachedClients(filter)
}

function promptAddClient(){
    prompt({
        parentWindow : remote.BrowserWindow,
        alwaysOnTop : true,
        title: localization.getLocaleText("addClientTitle",localization.appErrors),
        label: localization.getLocaleText("addClientName",localization.appErrors),
        width : 500,
        height: 200,
        customStylesheet : './styles/prompt-style.css',
        inputAttrs: {
            type: 'text',
            required: true
        },
        type: 'input'
    })
    .then((name) => {
        if(name === null) {
            console.log('user cancelled');
        } 
        else {
            var clientKnown = false;
            for(var i = 0 ; i < CACHE_CLIENT.length; i++){
                if(CACHE_CLIENT[i].name == name){
                    clientKnown = true;
                    break;
                }
            }

            if(clientKnown){
                general.showMessage(false, localization.getLocaleText("clientAlreadyExists",localization.appErrors));
            }else {
                promptAddEmail(name);
            }
        }
    })
    .catch(console.error);
}

function promptAddEmail(name){
    prompt({
        parentWindow : remote.BrowserWindow,
        alwaysOnTop : true,
        title: localization.getLocaleText("addClientTitle",localization.appErrors),
        label: localization.getLocaleText("addClientEmail",localization.appErrors) + name,
        width : 500,
        height: 200,
        type: 'input',
        customStylesheet : './styles/prompt-style.css'
    })
    .then((email) => {
        addClient(name, email);
        general.showMessage(true, localization.getLocaleText("clientAddedSuccess",localization.appErrors))
    })
    .catch(console.error);
}

function addClient(name, email){
    CACHE_CLIENT.unshift({
        name : name, 
        email : (email != null)? email: "",
        id : general.create_UUID()
    });

    store.set('cachedClients', CACHE_CLIENT);

    const myNode = document.getElementById("cachedClientsList");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild);
    }
    
    setCachedClients(document.getElementById("searchClient").value);
}

//SETTING UP FUNCTIONS TO BUTTONS
function assignFunctionToButtons(){

    document.querySelector('#btnSuccess').addEventListener('click', () => {
        general.hideElement("success");
    });

    document.querySelector('#btnDanger').addEventListener('click', () => {
        general.hideElement("danger");
    });

    document.querySelector("#searchClient").addEventListener('input', () => {
        filterClientSearch();
    });

    document.querySelector("#addClient").addEventListener('click', () => {
        promptAddClient();
    });
    
}