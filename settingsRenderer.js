//IMPORTS
const Store = require('electron-store');
const store = new Store();
const keytar = require('keytar');
$ = require('jquery');
const { dialog } = require('electron').remote;
const { remote, shell } = require('electron');
const ElectronGoogleOAuth2 = require('@getstation/electron-google-oauth2').default;
const localization = require('./js/localization.js');
const general = require("./js/general-functions.js");
const update = require("./js/updates.js");
require('bootstrap');
var fsystem = require('fs');

const myApiOauth = new ElectronGoogleOAuth2(
    process.env.OAUTH2CLIENTID,
    process.env.OAUTHCLIENTSECRET,
    ['https://mail.google.com/']
);

var LANG = store.get("lang");

//VARIABLES
var showExitSaveMessage = false;    

//INITIAL FUNCTIONS

localization.setLocaleText("settings", LANG);
assignFunctionToButtons();
setInitialValues();
general.assignDarkTheme();
general.setEditor();

//FUNCTIONS
function setInitialValues(){
    store.get("currentTab") === undefined ? openTab("generalTab", "generalTabItem") : openTab(store.get("currentTab").tabName,store.get("currentTab").tabItem);

    document.querySelector('#sellerName').value = (store.get('sellerName') === undefined) ? "": store.get('sellerName');
    document.querySelector('#sellerTitle').value = (store.get('sellerTitle') === undefined) ? "": store.get('sellerTitle');
    document.querySelector('#registrationID').value = (store.get('sellerRegistrationID') === undefined) ? "": store.get('sellerRegistrationID');
    document.querySelector('#sellerAddress').value = (store.get('sellerAddress') === undefined) ? "": store.get('sellerAddress');
    document.querySelector('#sellerPhone').value = (store.get('sellerPhone') === undefined) ? "": store.get('sellerPhone');
    document.querySelector('#sellerEmail').value = (store.get('sellerEmail') === undefined) ? "": store.get('sellerEmail');
    document.querySelector('#signature').value = (store.get('signature') === undefined) ? "": store.get('signature');
    document.querySelector('#sendingEmail').value = (store.get('sendingEmail') === undefined) ? "": store.get('sendingEmail');
    document.querySelector('#emailsmtp').value = (store.get('emailsmtp') === undefined) ? "": store.get('emailsmtp');
    document.querySelector('#filepath').value = (store.get('filepath') === undefined) ? "": store.get('filepath');
    document.querySelector('#emailTemplate').value = (store.get('emailTemplate') === undefined) ? "": store.get('emailTemplate');
    document.querySelector('#subjetTemplate').value = (store.get('subjetTemplate') === undefined) ? "": store.get('subjetTemplate');
    document.querySelector('#dark-theme').checked = (store.get("dark-theme") === undefined) ? false : store.get("dark-theme");
    document.querySelector('#signatureImg').src = (store.get('signature') === undefined) ? "": store.get('signature');
    document.querySelector("#currencyMainValue").value = (store.get("currencyMainValue") === undefined) ? "" : store.get("currencyMainValue");
    document.querySelector("#currencySubValue").value = (store.get("currencySubValue") === undefined) ? "" : store.get("currencySubValue");
    document.querySelector("#currencyCodeValue").value = (store.get("currencyCodeValue") === undefined) ? "" : store.get("currencyCodeValue");
    document.querySelector("#currencySignValue").value = (store.get("currencySignValue") === undefined) ? "" : store.get("currencySignValue");
    document.querySelector("#currencySignBeforeAfter").checked = (store.get("currencySignBeforeAfter") === undefined) ? "" : store.get("currencySignBeforeAfter");

    //list the services
    var storedServices = (store.get('sellerServices') == null) ? [] : store.get('sellerServices'); 
    storedServices.forEach(s => {
        addService(s);
    });
    
    //list the taxes 
    var storedTaxes = (store.get('sellerTaxes') == null) ? [] : store.get('sellerTaxes'); 
    storedTaxes.forEach(t => {
        addTax(t);
    });

    // add languages to the dropdown
    var languages = localization.appLanguages;
    languages.forEach(l => {
        addLanguageToDropdown(l);
    });

    //get password from keytar
    keytar.getPassword('Terative','mainUser').then((result) => {
        document.querySelector('#emailPassword').value = (result === undefined) ? "": result;
    });

    //set Last Backup Date
    var stats = fsystem.statSync(store.path.replace(".json","_backup.json"));
    document.querySelector("#lastBackupDate").innerHTML = stats.mtime.toLocaleString()

    assignListenerToEverything();
}

function savePersonnalInfo(){
    this.tinymce.activeEditor.save();
    store.set('sellerName', document.querySelector('#sellerName').value);
    store.set('sellerTitle', document.querySelector('#sellerTitle').value);
    store.set('sellerRegistrationID', document.querySelector('#registrationID').value);
    store.set('sellerAddress',  document.querySelector('#sellerAddress').value);
    store.set('sellerPhone', document.querySelector('#sellerPhone').value);
    store.set('sellerEmail', document.querySelector('#sellerEmail').value);
    store.set('sendingEmail', document.querySelector('#sendingEmail').value);
    store.set('filepath', document.querySelector('#filepath').value);
    store.set('emailsmtp', document.querySelector('#emailsmtp').value);
    store.set('signature', document.querySelector('#signature').value);
    store.set('emailTemplate', document.querySelector("#emailTemplate").value);
    store.set('subjetTemplate', document.querySelector("#subjetTemplate").value);
    store.set("currencyMainValue",document.querySelector("#currencyMainValue").value);
    store.set("currencySubValue",document.querySelector("#currencySubValue").value);
    store.set("currencyCodeValue",document.querySelector("#currencyCodeValue").value);
    store.set("currencySignValue",document.querySelector("#currencySignValue").value);
    store.set("currencySignBeforeAfter",document.querySelector("#currencySignBeforeAfter").checked);

    if(document.querySelector("#emailPassword").value != "")
        keytar.setPassword('Terative','mainUser',document.querySelector("#emailPassword").value);

    var services = Array();
    document.getElementById("listServicesPerso").childNodes.forEach(child => {
        
        var serviceObject = new Object();
        child.childNodes.forEach(grandChild => {

            if(grandChild.name == "name"){
                serviceObject.name = grandChild.value;
            }
            if(grandChild.name == "priceNum"){
                serviceObject.priceNum = grandChild.value;
            }
        });

        if(serviceObject.name != "" && serviceObject.priceNum != ""){
            services.push(serviceObject);
        }
    });
    store.set('sellerServices', services);

    var taxes = Array();
    document.getElementById("listTaxesPerso").childNodes.forEach(child => {
        
        var taxObject = new Object();
        child.childNodes.forEach(grandChild => {
           
            if(grandChild.name == "taxName"){
                taxObject.taxName = grandChild.value;
            }
            if(grandChild.name == "taxPercentage"){
                taxObject.taxPercentage = grandChild.value;
            }
            if(grandChild.name == "taxId"){
                taxObject.taxId = grandChild.value;
            }
        });

        if(taxObject.taxName != "" && taxObject.taxPercentage != ""){
            taxes.push(taxObject);
        }
    });
    store.set('sellerTaxes', taxes);
}

function addService(value){
    var inputGroup = document.createElement("div");
    var input = document.createElement("input");
    var inputPriceNum = document.createElement("input");
    var classAppendTrash = document.createElement("div");
    var classAppendCurrencySign = document.createElement("div");
    var button = document.createElement("button");
    var trash = document.createElement("i");
    var currencySign = document.createElement("span");


    inputGroup.className="input-group mb-2"
    button.className="btn btn-outline-secondary ";
    button.type = "button";
    button.name="button";
    trash.className="fa fa-trash"
    currencySign.className = "input-group-text";
    currencySign.innerHTML= store.get("currencySignValue");

    button.onclick = function() { this.parentNode.parentNode.remove() };
    input.setAttribute('aria-describedby','basic-addon2')
    inputPriceNum.setAttribute('aria-describedby','basic-addon2')
    classAppendTrash.className="input-group-append";
    classAppendCurrencySign.className="input-group-append"
    classAppendCurrencySign.id = "sign";

    input.type= "text";
    input.className="form-control input-sm";
    input.placeholder= localization.getLocaleText("serviceName", localization.appText);
    input.name = "name"
    input.value = (value === null || value ===undefined) ? "" : value.name;

    inputPriceNum.type= "number";
    inputPriceNum.className="form-control input-sm";
    inputPriceNum.placeholder= localization.getLocaleText("price", localization.appText);
    inputPriceNum.name = "priceNum";
    inputPriceNum.value = (value === null || value ===undefined) ? "" : value.priceNum;

    button.appendChild(trash);
    classAppendCurrencySign.append(currencySign);
    classAppendTrash.appendChild(button);
    inputGroup.appendChild(input);
    inputGroup.appendChild(inputPriceNum);
    inputGroup.appendChild(classAppendCurrencySign);
    inputGroup.appendChild(classAppendTrash);
    document.getElementById("listServicesPerso").appendChild(inputGroup);
}


function addTax(value){
    var inputGroup = document.createElement("div");
    var inputTaxName = document.createElement("input");
    var inputTaxPercentage = document.createElement("input");
    var inputTaxId = document.createElement("input");
    var classAppendTrash = document.createElement("div");
    var classAppendPercentageSign = document.createElement("div");
    var button = document.createElement("button");
    var trash = document.createElement("i");
    var percentageSign = document.createElement("span");

    inputGroup.className="input-group mb-2"
    button.className="btn btn-outline-secondary ";
    button.type = "button";
    button.name="button";
    trash.className="fa fa-trash"
    percentageSign.className = "input-group-text";
    percentageSign.innerHTML = "%";

    button.onclick = function() { this.parentNode.parentNode.remove() };
    inputTaxName.setAttribute('aria-describedby','basic-addon2')
    inputTaxPercentage.setAttribute('aria-describedby','basic-addon2')
    inputTaxId.setAttribute('aria-describedby','basic-addon2')
    classAppendTrash.className="input-group-append";
    classAppendPercentageSign.className="input-group-append";
    classAppendPercentageSign.id="sign";

    inputTaxName.type= "text";
    inputTaxName.className="form-control input-sm";
    inputTaxName.placeholder= localization.getLocaleText("taxName", localization.appText);
    inputTaxName.name = "taxName"
    inputTaxName.value = (value === null || value ===undefined) ? "" : value.taxName;

    inputTaxPercentage.type= "number";
    inputTaxPercentage.className="form-control";
    inputTaxPercentage.placeholder= localization.getLocaleText("percentage", localization.appText);
    inputTaxPercentage.name = "taxPercentage";
    inputTaxPercentage.value = (value === null || value ===undefined) ? "" : value.taxPercentage;

    inputTaxId.type= "text";
    inputTaxId.className="form-control";
    inputTaxId.placeholder = localization.getLocaleText("taxId", localization.appText);
    inputTaxId.name = "taxId";
    inputTaxId.value = (value === null || value ===undefined) ? "" : value.taxId;

    button.appendChild(trash);
    classAppendTrash.appendChild(button);
    classAppendPercentageSign.appendChild(percentageSign);
    inputGroup.appendChild(inputTaxName);
    inputGroup.appendChild(inputTaxPercentage);
    inputGroup.appendChild(classAppendPercentageSign);
    inputGroup.appendChild(inputTaxId);
    inputGroup.appendChild(classAppendTrash);
    document.getElementById("listTaxesPerso").appendChild(inputGroup);
}

function addLanguageToDropdown(languageArray){
    var a = document.createElement("a");
    a.innerHTML = languageArray[1];
    a.classList.add("dropdown-item");
    a.onclick = function() {
         store.set("lang",languageArray[0]);
          reloadPage();
    };
    if(languageArray[0] == LANG){
        a.classList.add("active");
    }

    document.getElementById("languageDropdown").appendChild(a);
}

function chooseImageAndTransfertToB64(){
    var input = document.createElement('input');
    input.type = 'file';
    input.id = "fileSelectInput";
    input.setAttribute("accept","image/png, image/jpeg, image/jpg")

    input.onchange = e => { 
        var file = e.target.files[0]; 
        if (file) {
    
            var FR= new FileReader();
            
            FR.addEventListener("load", function(s) {
              document.getElementById("signature").value = s.target.result;
              document.querySelector('#signatureImg').src = s.target.result;
            }); 
            
            FR.readAsDataURL( file );

        }
    }
    input.click(); 
}

function chooseDirectoryPath(){
    var files = dialog.showOpenDialogSync( {properties: ['openDirectory', 'createDirectory']});   

    if(files.length > 0){
        return files[0];
    }
    else {
        general.showMessage(false, localization.getLocaleText("invalidDirectory", localization.appErrors));
    }
}

function showPassword(){
    var input = document.getElementById("emailPassword");
    if(input.type == "password"){
        input.type = "text";
       document.getElementById("eye").className = "fa fa-eye";
    } else {
        input.type = "password";
        document.getElementById("eye").className = "fa fa-eye-slash";
    }
}

function returnToMainPage(){
    let options  = {
        title: localization.getLocaleText("saveModifTitle",localization.appErrors),
        buttons: [localization.getLocaleText("saveModifOption1",localization.appErrors),
            localization.getLocaleText("saveModifOption2",localization.appErrors)],
        message: localization.getLocaleText("saveModifText",localization.appErrors),
        cancelId : 2,
        icon : "./assets/logo.png"
    }

    store.delete("currentTab");

    if(showExitSaveMessage == true || tinymce.activeEditor.isDirty()){
        var res = dialog.showMessageBoxSync(options);
        
        if(res == 0){
            savePersonnalInfo();
        }

        if(res != 2){
            remote.getCurrentWindow().loadURL(`file://${__dirname}/index.html`);
        }
        
    } else {
        remote.getCurrentWindow().loadURL(`file://${__dirname}/index.html`);
    }
}

function checkDarkThemeBool(bool){
    store.set("dark-theme",bool);
    if(bool){
        document.getElementsByTagName("body")[0].className = "dark-theme";
    }
    else {
        document.getElementsByTagName("body")[0].className = "light-theme";
    }
}

function openTab(tabName, tabItemName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabItemName).style.display = "block";
    document.getElementById(tabName).className += " active";
}

function reloadPage(){
    var options  = {
        title: localization.getLocaleText("saveModifTitle", localization.appErrors),
        buttons: [ localization.getLocaleText("saveModifOption1", localization.appErrors),
        localization.getLocaleText("saveModifOption2", localization.appErrors)],
        message: localization.getLocaleText("saveModifText", localization.appErrors),
        cancelId : 2,
        icon : "./assets/logo.png"
    }
    
    if(showExitSaveMessage == true || tinymce.activeEditor.isDirty()){
        var res = dialog.showMessageBoxSync(options);

        if(res == 0){
            savePersonnalInfo();
        }
        
        if(res != 2){
            location.reload();
        }

    } else {
        location.reload();
    }
}

function chooseConfigFileForImport(){
    var input = document.createElement('input');
    input.type = 'file';
    input.id = "fileSelectInput";
    input.setAttribute("accept",".json")
    input.onchange = e => { 
        var file = e.target.files[0]; 
        if (file) {
            //create backup
            update.createBackup();
            //copy new config file
            fsystem.copyFile(file.path, store.path, (err) => {
                if (err) 
                    general.showMessage(false, err);
                else{
                    location.reload();
                }
            });
        }
    }
    input.click();
}

function restoreBackup(){
    var backupPath = store.path
    backupPath = backupPath.replace(".json","_backup.json");

    var options  = {
        title: localization.getLocaleText("saveModifTitle", localization.appErrors),
        message: localization.getLocaleText("irreversibleActionMessage", localization.appErrors),
        buttons: [ localization.getLocaleText("ok", localization.appErrors),
        localization.getLocaleText("cancelReceiptOption2", localization.appErrors)],
        cancelId : 2,
        icon : "./assets/logo.png"
    }
    
    var res = dialog.showMessageBoxSync(options);

    if(res == 0){
        fsystem.copyFile(backupPath, store.path, (err) => {
            if (err) 
                general.showMessage(false, err);
            else{
                location.reload();
            }
        });
    }
}

//SETTING UP FUNCTIONS TO BUTTONS
function assignFunctionToButtons(){
    document.querySelector('#addService').addEventListener('click', () => {
        addService(null);
    });

    document.querySelector('#showPassword').addEventListener('click', () => {
        showPassword();
    });

    document.querySelector("#chooseSignature").addEventListener('click',() =>{
        chooseImageAndTransfertToB64();
    });

    document.querySelector("#chooseDirectory").addEventListener('click',() =>{
        var directory = chooseDirectoryPath();
        this.document.getElementById("filepath").value = directory;
    });

    document.querySelector('#addTax').addEventListener('click', () => {
        addTax(null);
    });

    document.querySelector('#returnButton').addEventListener('click', () => {
        returnToMainPage();
    });

    document.querySelector('#google-sign-in').addEventListener('click', () => {
        myApiOauth.openAuthWindowAndGetTokens()
        .then(token => {
            console.log(token);
        });
    });

    document.querySelector("#dark-theme").addEventListener('change', () => {
        $(".cover").fadeIn(10);
        checkDarkThemeBool(document.querySelector('#dark-theme').checked);
        reloadPage();
    });

    document.querySelector('#generalTab').addEventListener('click', () => {
        store.set("currentTab", {
            tabName : "generalTab",
            tabItem : "generalTabItem"
        });
        openTab("generalTab", 'generalTabItem')
    });

    document.querySelector('#emailTab').addEventListener('click', () => {
        store.set("currentTab", {
            tabName : "emailTab",
            tabItem : "emailTabItem"
        });
        openTab("emailTab", 'emailTabItem')
    });

    document.querySelector('#servicesTab').addEventListener('click', () => {
        store.set("currentTab", {
            tabName : "servicesTab",
            tabItem : "servicesTabItem"
        });
        openTab("servicesTab", 'servicesTabItem')
    });

    document.querySelector('#taxesTab').addEventListener('click', () => {
        store.set("currentTab", {
            tabName : "taxesTab",
            tabItem : "taxesTabItem"
        });
        openTab("taxesTab", 'taxesTabItem')
    });

    document.querySelector('#settingsTab').addEventListener('click', () => {
        store.set("currentTab", {
            tabName : "settingsTab",
            tabItem : "settingsTabItem"
        });
        openTab("settingsTab", 'settingsTabItem')
    });

    document.querySelector("#importButton").addEventListener('click',() => {
        chooseConfigFileForImport();
    });

    document.querySelector("#exportButton").addEventListener('click', () => {
        var directory = chooseDirectoryPath();

        update.createBackup();

        fsystem.copyFile(store.path, directory + "/config.json", (err) => {
            if (err) 
                general.showMessage(false, err);
            else
                general.showMessage(true, localization.getLocaleText("successfulExport", localization.appErrors));
        });
    });
    
    document.querySelector("#restoreButton").addEventListener('click', () => {
        restoreBackup();
    })

    document.querySelector("#openBackupConfigFile").addEventListener('click', () => {
        shell.showItemInFolder(store.path.replace(".json","_backup.json"));
    });

    document.querySelector("#openCurrentConfigFile").addEventListener('click', () => {
        shell.showItemInFolder(store.path);
    });

    document.querySelector("#createBackup").addEventListener('click', () => {
        update.createBackup();

        var currentTime = new Date();
        document.querySelector("#lastBackupDate").innerHTML = currentTime.toLocaleString();
    });

    document.querySelector("#saveSettingsButton").addEventListener('click',() => {
        savePersonnalInfo();
        showExitSaveMessage = false; 
    })
}

function assignListenerToEverything(){
    
    $(".form-control").on("change keyup paste", function(){
        showExitSaveMessage = true; 
    });

    $(".btn").on("change keyup paste click", function(){
        showExitSaveMessage = true;
    });

    //remove listener from save button, export file, open files, create backup
    $( "#saveSettingsButton").off();
    $( "#exportButton").off();
    $( "#openCurrentConfigFile").off();
    $( "#openBackupConfigFile").off();
    $( "#createBackup").off();
}