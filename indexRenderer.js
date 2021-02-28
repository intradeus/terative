//IMPORTS
const Store = require('electron-store');
const Invoice = require("nodeice");
const nodemailer = require('nodemailer');
const {shell} = require('electron');
const store = new Store();
var fsystem = require('fs');
const keytar = require('keytar');
window.$ = window.jQuery = require('jquery');
const { dialog } = require('electron').remote;
var writtenNumber = require('written-number');
const datepicker = require('js-datepicker')
const localization = require('./js/localization.js');
const general = require("./js/general-functions.js");
const update = require("./js/updates.js");
const { degrees, PDFDocument, rgb, StandardFonts } = require('pdf-lib');

//VARIABLES
var CACHE_CLIENT = store.get("cachedClients");
var receiptPath = null;
var LANG = (store.get("lang"))? store.get("lang"):"fr_FR";
writtenNumber.defaults.lang = LANG.substring(0, LANG.length-3);
const picker = datepicker('#date', getDatepickerOptions());
const picker2 = datepicker('#UplodadedFileDate', getDatepickerOptions());

//INITIAL FUNCTIONS
localization.setLocaleText("index");
general.assignDarkTheme();
assignFunctionToButtons();
setInitialValues();
updateNamesOptions();
updateEmailsOptions();
general.setEditor();
update.updateBetweenVersions();

//FUNCTIONS
function getDatepickerOptions(){
    var datepickerOptions = {};
    if(LANG == "fr_FR"){
        datepickerOptions = {
            customDays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            customMonths: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            formatter: (input, date, instance) => {
                const value = date.toLocaleDateString(LANG.replace('_','-'))
                input.value = value
            }
        }
    } else if(LANG == "en_US"){
        datepickerOptions = {
            formatter: (input, date, instance) => {
                const value = date.toLocaleDateString(LANG.replace('_','-'))
                input.value = value
            }
        }
    }

    return datepickerOptions;
}

function updateNamesOptions(){
    if(CACHE_CLIENT){
        document.getElementById("cacheNames").innerHTML = '';
        document.getElementById("UplodadedFileCacheNames").innerHTML = '';

        CACHE_CLIENT.forEach(n => {
            addOptionsDataList("cacheNames", n.name);
            addOptionsDataList("UplodadedFileCacheNames", n.name)
        });
    } else {
        CACHE_CLIENT = [];
    }
}


function updateEmailsOptions(){ 
    if(CACHE_CLIENT){
        document.getElementById("cacheEmails").innerHTML = '';
        
        CACHE_CLIENT.forEach(n => {
            addOptionsDataList("cacheEmails", n.email);
        });
    } else {
        CACHE_CLIENT = [];
    }
}


function setEmail(clientName){
    CACHE_CLIENT.forEach(n =>{
        if(n.name == clientName){
            if(n.email != ""){
                document.querySelector('#clientEmail').value = n.email;
            }else {
                document.querySelector('#clientEmail').value = "";
            }
        }
    });
    
}


function setInitialValues(){
    if( store.get('receiptNumber') !== undefined ){
        document.querySelector('#receiptNumber').readOnly = true;
    }

    document.querySelector('#receiptNumber').value = (store.get('receiptNumber') === undefined) ? "": store.get('receiptNumber');
    document.querySelector('#emailSubject').value = (store.get('subjetTemplate') === undefined) ? "": store.get('subjetTemplate');
    document.querySelector('#emailContent').value =(store.get('emailTemplate') === undefined) ? false : store.get('emailTemplate');
    document.querySelector('#taxes').checked = (store.get('taxesbool') === undefined) ? false : store.get('taxesbool');

    var storedServices = (store.get('sellerServices') == null) ? [] : store.get('sellerServices'); 
    storedServices.forEach(s => {
        addOptionsDataList("services", s.name);
    });
}


function addOptionsDataList(id, value){
    var option = document.createElement("option");
    option.value = value;
    document.getElementById(id).appendChild(option);
}

function checkTaxesbool(bool) {
    store.set("taxesbool",bool);

    if(bool == true && store.get("sellerTaxes").length == 0){
        var options  = {
            title: localization.getLocaleText("taxNeededTitle",localization.appErrors),
            buttons: [localization.getLocaleText("ok",localization.appErrors)],
            message: localization.getLocaleText("taxNeededText",localization.appErrors),
            icon : "./assets/logo.png"
        }
        dialog.showMessageBoxSync(options);
        store.set("taxesbool",!bool);
        document.querySelector('#taxes').checked = !bool;
    }
}

function createPDF(){
        document.querySelector("#create").disabled = true;
        toggleLoading();
        general.hideElement("success");
        general.hideElement("danger");
        document.getElementById("UplodadedFileDate").value = "";
        document.getElementById("UplodadedFileClientName").value = "";
        if(!document.getElementById("uploadedFileForm").classList.contains('hidden')){
            document.getElementById("uploadedFileForm").classList.add('hidden')
        }
        
        if(document.querySelector('#clientName').value == ""){
            toggleLoading();
            general.showMessage(false, localization.getLocaleText("enterClientName",localization.appErrors));
            document.querySelector("#create").disabled = false;
            return;
        }

        if(document.querySelector('#service').value == ""){
            toggleLoading();
            general.showMessage(false, localization.getLocaleText("selectService",localization.appErrors));
            document.querySelector("#create").disabled = false;
            return;
        }
        
        if(document.querySelector('#date').value == ""){
            toggleLoading();
            general.showMessage(false, localization.getLocaleText("selectDate",localization.appErrors));
            document.querySelector("#create").disabled = false;
            return;
        }

        if( store.get('receiptNumber') === undefined ){
            store.set('receiptNumber', document.querySelector("#receiptNumber").value);
            document.querySelector('#receiptNumber').readOnly = true;
        }

        if(store.get("")){

        }

        var pathTemplate = (process.platform == 'darwin') ? "/template/template1.html" : "\\template\\template1.html";
        var pathRow = (process.platform == 'darwin') ? "/template/row.html" : "\\template\\row.html";
        var pathRowTaxes = (process.platform == 'darwin') ? "/template/taxRowTemplate.html" : "\\template\\taxRowTemplate.html";

        var taxesIds = "";

        var totalTasks = new Array();
        totalTasks.push({
            description: document.querySelector('#service').value,
            unitPrice: document.querySelector('#unitPriceNumber').value});

        if(store.get("taxesbool") == true){

            var taxes = store.get('sellerTaxes');

            taxes.forEach(tax => {
                var stringTaxPerc = tax.taxPercentage;
                if(tax.taxPercentage.includes(","))
                    stringTaxPerc.replace(",",".");
                
                var intTaxPerc = (parseFloat(stringTaxPerc)/100);

                if(tax.taxId != "")
                    taxesIds += tax.taxName + " : " + tax.taxId + " \xa0 \xa0";

                var taskTempo = {
                    description : (tax.taxName + " (" + tax.taxPercentage + "%)"),
                    unitPrice : (((parseFloat(document.querySelector('#unitPriceNumber').value) * intTaxPerc).toFixed(2)).toString())
                };
                totalTasks.push(taskTempo);
            });
        }
        var totalNumber = 0.00;
        totalTasks.forEach(task => {
            totalNumber += parseFloat(parseFloat(task.unitPrice).toFixed(2));
        });

        var totalNumberIntAndDecimals = totalNumber.toString().split('.');

        var totalNumberInt = (totalNumberIntAndDecimals[0]) ? totalNumberIntAndDecimals[0] : "0";
        var totalNumberDecimals = "";
        if(totalNumberIntAndDecimals[1]){
            totalNumberDecimals = (totalNumberIntAndDecimals[1].substring(0, 2))
            if(totalNumberDecimals.length == 1){
                totalNumberDecimals += "0";
            }
            if(totalNumberDecimals.length == 0){
                totalNumberDecimals += "00";
            }
        }  else {
            totalNumberDecimals= "00";
        }
        var totalLetter = writtenNumber(parseInt(totalNumberInt)) + " " + store.get("currencyMainValue") + 
            localization.getLocaleText("and",localization.appErrors) + writtenNumber(parseInt(totalNumberDecimals)) +
             " " + store.get("currencySubValue");

        let myInvoice = new Invoice({
            config: {
                template: __dirname + pathTemplate,
                tableRowBlock: __dirname + pathRow,
                tableTaxes : __dirname + pathRowTaxes

            },
            data: {
                invoice: {
                    currency: {
                        main: store.get("currencyCodeValue")
                    }
                },
                tasks: totalTasks
            },
            seller: {  
                name: store.get('sellerName'),
                title: store.get('sellerTitle'),
                registrationID: store.get('sellerRegistrationID'),
                address: store.get('sellerAddress'),
                phone: store.get('sellerPhone'),
                email: store.get('sellerEmail'),
                date: document.querySelector('#date').value,
                receiptNumber: store.get('receiptNumber'),
                signature: store.get('signature'),
                taxesIds : taxesIds,
            },
            buyer: {
                name: document.querySelector('#clientName').value,
                unitPriceLetter : (totalLetter.toString().substring(0, 1).toUpperCase() + totalLetter.toString().substring(1)),
                total : totalNumberInt + "." + totalNumberDecimals
            }
        });

        
        fsystem.access(store.get('filepath') , function(err) {
            if (err && err.code === 'ENOENT') {
                toggleLoading();
                general.showMessage(false, localization.getLocaleText("invalidFilePath",localization.appErrors));
                document.querySelector("#create").disabled = false;
                return;
            }
        });
        // Render invoice as HTML and PDF
        receiptPath = store.get('filepath') + "/" + document.querySelector('#clientName').value + "_reçu#"+ store.get('receiptNumber') + ".pdf";
        myInvoice.toHtml(null, (err, data) => {
        }).toPdf(receiptPath, (err, data) => {
            if(err){
                toggleLoading();
                general.showMessage(false, err);
                document.querySelector("#create").disabled = false;
                return;
            }else {
                toggleLoading();
                general.showMessage(true, localization.getLocaleText("successPdfCreation",localization.appErrors));

                document.getElementById("showPDF").classList.remove("hidden");
                document.getElementById("showPDF").innerHTML = localization.getLocaleText("showPdf",localization.appText) + "#" + store.get('receiptNumber') +
                 localization.getLocaleText("of",localization.appText) + document.querySelector('#clientName').value;

                document.getElementById("attachmentName").innerHTML = localization.getLocaleText("attachment",localization.appText) + 
                 localization.getLocaleText("receipt",localization.appText) + "#" + store.get('receiptNumber') + localization.getLocaleText("of",localization.appText) +
                 document.querySelector('#clientName').value;

                if(CACHE_CLIENT.length == 0){
                    CACHE_CLIENT.push({
                        name : document.querySelector('#clientName').value,
                        email : '',
                        id: general.create_UUID()
                    });
                } else {
                    var unknown = true;
                    for(var i = 0; i < CACHE_CLIENT.length; i++){
                        if(CACHE_CLIENT[i].name == document.querySelector('#clientName').value){
                            unknown = false;
                            break;
                        }
                    }

                    if(unknown){
                        CACHE_CLIENT.push({
                            name : document.querySelector('#clientName').value,
                            email : '',
                            id: general.create_UUID()
                        });
                    }
                }

                updateNamesOptions();
                store.set('cachedClients', CACHE_CLIENT);
                store.set('tempclientName', document.querySelector('#clientName').value);
                store.set('tempdate', document.querySelector('#date').value);
            
                var newReceiptNumber = parseInt(store.get('receiptNumber')) + 1;
                store.set('receiptNumber', newReceiptNumber.toString());
                document.querySelector('#receiptNumber').value = newReceiptNumber;
                document.getElementById("sendEmail").disabled = false;
                
                clearInputs();

                document.querySelector("#create").disabled = false;
            }
        });         
}

function choosePdf(){
    store.set('tempclientName', "");
    store.set('tempdate', "");

    var files = dialog.showOpenDialogSync( {
        defaultPath : store.get("filepath"),
        properties: ['openFile'],
        filters: [{ name : 'PDF', extensions: ['pdf'] }]
    });

    if(files === undefined){
        return;
    } 
    else if(files.length > 0){
        receiptPath = files[0];
        document.getElementById("attachmentName").innerHTML = localization.getLocaleText("attachment",localization.appText) + receiptPath;
        document.getElementById("sendEmail").disabled = false;
        document.getElementById("uploadedFileForm").classList.remove("hidden");
    }
    else {
        general.showMessage(false, localization.getLocaleText("invalidFile",localization.appErrors));
    }
}

function openPDF(){
    shell.openItem(receiptPath);
}

async function cancelPDF(){
    toggleLoading();
    var cancelledPdfPath = "";
    var res = {};
    var old = false;
    
    // Show message asking for which receipt to cancel 
    if(receiptPath != null && !receiptPath.includes(localization.getLocaleText("cancelled",localization.appText))){
        var name = receiptPath.replace(/^.*[\\\/]/, '');
        var boxOptions1  = {
            title: localization.getLocaleText("cancelReceiptTitle",localization.appErrors),
            buttons: [localization.getLocaleText("cancelReceiptOption1",localization.appErrors),
                localization.getLocaleText("cancelReceiptOption2",localization.appErrors) + name],
            cancelId: 2,
            message:  localization.getLocaleText("cancelReceiptText",localization.appErrors) + "(" + name + ") ?",
            icon : "./assets/logo.png"
        }

        res = await dialog.showMessageBox(boxOptions1);
    }else {
        old = true;
    }
    
    if(old || res.response == 0){
        var files = dialog.showOpenDialogSync( {
            defaultPath : store.get("filepath"),
            properties: ['openFile'],
            filters: [{ name : 'PDF', extensions: ['pdf'] }]
        });

        if(files === undefined){
            toggleLoading();
            return;
        } 
        else if(files.length > 0){
            cancelledPdfPath = files[0];
        }
        else {
            general.showMessage(false, localization.getLocaleText("invalidFile",localization.appErrors));
        }
    }
    else if(res.response == 1){
        cancelledPdfPath = receiptPath
    } 
    else if(res.response == 2){
        toggleLoading();
        return;
    }
    else {
        general.showMessage(false, localization.getLocaleText("invalidChoice",localization.appErrors));
    }

    // Show confirmation message for cancellation
    var name2 = cancelledPdfPath.replace(/^.*[\\\/]/, '');

    var boxOptions2 = {
        title: localization.getLocaleText("cancelReceiptTitle",localization.appErrors),
        buttons: [localization.getLocaleText("yes",localization.appErrors),
            localization.getLocaleText("no",localization.appErrors)],
        message: localization.getLocaleText("confirmCancellationText1",localization.appErrors) + name2 +
             localization.getLocaleText("confirmCancellationText2",localization.appErrors),
        cancelId : 2,
        icon : "./assets/logo.png"
    }

    res = await dialog.showMessageBox(boxOptions2);
    
    // Cancel PDF
    if(res.response == 0){
        var existingPdfBytes = null;
        try {
            existingPdfBytes = fsystem.readFileSync(cancelledPdfPath);
        } catch (err) {
            general.showMessage(false,err);
            toggleLoading();
            return;
        }
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const pages = pdfDoc.getPages()
        const firstPage = pages[0]

        const { width, height } = firstPage.getSize()

        var options = {};
        if(LANG == "fr_FR"){
            options = {
                x: 155,
                y: height / 2 + 400,
                size: 160,
                opacity: 0.4,
                font: helveticaFont,
                color: rgb(1,0,0),
                rotate: degrees(-45),
            }
        }else if(LANG == "en_US"){
            options = {
                x: 20,
                y: height / 2 + 500,
                size: 160,
                opacity: 0.4,
                font: helveticaFont,
                color: rgb(1,0,0),
                rotate: degrees(-45),
            }
        }
        firstPage.drawText(localization.getLocaleText("cancelled",localization.appText), options);

        const pdfBytes = await pdfDoc.save();

        //overwrite the file
        try {
            fsystem.writeFileSync(cancelledPdfPath, Buffer.from(pdfBytes));
        } catch(err){
            general.showMessage(false,err);
            toggleLoading();
            return;
        }

        //rename the file
        var n = cancelledPdfPath.lastIndexOf(".pdf");
        var newPath = cancelledPdfPath.substring(0,n)+"-"+localization.getLocaleText("cancelled",localization.appText)+cancelledPdfPath.substring(n);
        
        try{
            fsystem.renameSync(cancelledPdfPath,newPath);
        } catch(err){
            general.showMessage(false,err);
            toggleLoading();
            return;
        }

        //Set up new button and remove attachment file
        receiptPath = newPath;
        var name3 = newPath.replace(/^.*[\\\/]/, '');
        general.showElement("showPDF");
        document.getElementById("showPDF").innerHTML = localization.getLocaleText("showPdf",localization.appText) + name3;
        document.getElementById("attachmentName").innerHTML = localization.getLocaleText("attachment",localization.appText);
        document.getElementById("clientEmail").value = "";

        toggleLoading();
        general.showMessage(true, localization.getLocaleText("successCancellation",localization.appErrors));
    }else {
        return;
    }
    
}

function toggleLoading(){
    if(document.getElementById("loading").classList.contains("hidden"))
        document.getElementById("loading").classList.remove("hidden");
    else{
        document.getElementById("loading").classList.add("hidden");
    }
}


function clearInputs(){
    document.querySelector('#clientName').value = "";
    document.querySelector('#date').value = "";
    document.querySelector('#service').value = "";
    document.querySelector('#unitPriceNumber').value = "";
}


async function sendEmail(){
    document.getElementById("sendEmail").disabled = true;
    general.hideElement("success");
    general.hideElement("danger");
    toggleLoading();
    
    var pwd = await keytar.getPassword('Terative','mainUser');

    if(pwd == null || pwd == ""){
        toggleLoading();
        general.showMessage(false, localization.getLocaleText("emailPasswordMissing",localization.appErrors));
        return;
    }

    if(document.querySelector("#clientEmail").value == ""){
        toggleLoading();
        general.showMessage(false, localization.getLocaleText("clientEmailMissing",localization.appErrors));
        return;
    }

    if(document.querySelector("#emailSubject").value == ""){
        toggleLoading();
        general.showMessage(false, localization.getLocaleText("emailSubjectMissing",localization.appErrors));
        return;
    }

    if(store.get('sendingEmail') == ""){
        toggleLoading();
        general.showMessage(false, localization.getLocaleText("sendingEmailMissing",localization.appErrors));
        return;
    }

    const transporter = nodemailer.createTransport({
        host: store.get('emailsmtp'),
        secureConnection: false,
        port: 587,
        tls: {
            ciphers:'SSLv3'
        },
        requireTLS:true,
        auth: {
            user: store.get('sendingEmail'),
            pass: pwd
        }
    });
    tinymce.activeEditor.save();
    var emailcontent = (document.querySelector("#emailContent").value == "")? store.get("emailTemplate") : document.querySelector("#emailContent").value;
    const formattedMessage = formatText(emailcontent);
    if(formattedMessage == ""){
        return;
    }

    const formattedSubject = formatText(document.querySelector('#emailSubject').value);
    if(formattedSubject == ""){
        return;
    }

    const mailOptions = {
        from: store.get('sendingEmail'),
        to: document.querySelector('#clientEmail').value,
        subject: formattedSubject,
        html: formattedMessage,
        attachments : [
            {
                path: receiptPath,
            }
        ] 
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            toggleLoading();
            console.log(error)
            if(error.toString().includes("Invalid login")){
                general.showMessage(false, localization.getLocaleText("invalidLogin1",localization.appErrors) + localization.getLocaleText("invalidLogin2",localization.appErrors))
            }else if(error.toString().includes("ETIMEDOUT")){
                general.showMessage(false,localization.getLocaleText("emailTimeout",localization.appErrors));
            }else if(error.toString().includes("No recipients defined")){
                general.showMessage(false,localization.getLocaleText("invalidEmailRecipient",localization.appErrors));
            } else {
                general.showMessage(false, error);
            }
            document.getElementById("sendEmail").disabled = false;
            return;
        } else {
            toggleLoading();
            general.showMessage(true, localization.getLocaleText("successEmail",localization.appErrors) + document.querySelector('#clientEmail').value);
            var tempName = store.get("tempclientName");
            CACHE_CLIENT.forEach(n => {
                if(n.name == tempName){
                    n.email = document.querySelector('#clientEmail').value
                }
            });

            updateEmailsOptions();
            store.set('cachedClients', CACHE_CLIENT);
            document.getElementById("attachmentName").innerHTML = localization.getLocaleText("attachment",localization.appText) + "~";
            document.getElementById("sendEmail").disabled = true;
            document.getElementById("showPDF").classList.add("hidden");
            document.getElementById("clientEmail").value = "";
            document.getElementById("UplodadedFileDate").value = "";
            document.getElementById("UplodadedFileClientName").value = "";
            document.getElementById("emailSubject").value = store.get('subjetTemplate');

            if(!document.getElementById("uploadedFileForm").classList.contains('hidden')){
                document.getElementById("uploadedFileForm").classList.add('hidden')
            }
            store.set('tempclientName', "");
            store.set('tempdate', "");
            
            setEditor();
        }
    });
}

function formatText(string){
    var tempDate = (store.get('tempdate') != "") ? store.get('tempdate') : document.getElementById("UplodadedFileDate").value;
    var tempclientName = (store.get('tempclientName') != "") ? store.get('tempclientName') : document.getElementById("UplodadedFileClientName").value;

    if(tempDate == ""){
        general.showMessage(false, localization.getLocaleText("failReplaceDate",localization.appErrors));
        return "";
    }
    if(tempclientName == ""){
        general.showMessage(false, localization.getLocaleText("failReplaceClientName",localization.appErrors));
        return "";
    }

    var s1 = string.replace(/\{\{date\}\}/g, tempDate);
    var s2 = s1.replace(/\{\{client\}\}/g, tempclientName);
    return s2;
}


function setPrice(){
    var service = document.getElementById("service").value;
    
    store.get('sellerServices').forEach(object => {
        if(object.name == service){
            document.getElementById("unitPriceNumber").value = object.priceNum;
        }
    })
}


//SETTING UP FUNCTIONS TO BUTTONS
function assignFunctionToButtons(){

    document.querySelector('#service').addEventListener('change', () => {
        setPrice();
    });
    
    document.querySelector('#clientName').addEventListener('blur', () => {
        setEmail(document.querySelector('#clientName').value);
    });

    document.querySelector('#btnSuccess').addEventListener('click', () => {
        general.hideElement("success");
    });

    document.querySelector('#btnDanger').addEventListener('click', () => {
        general.hideElement("danger");
    });

    document.querySelector('#showPDF').addEventListener('click', () => {
        openPDF();
    });

    document.querySelector("#cancelPDF").addEventListener('click',() =>{
        cancelPDF();
    });

    document.querySelector('#create').addEventListener('click', () => {
        createPDF();
    });

    document.querySelector('#sendEmail').addEventListener('click', () => {
        sendEmail();
    });

    document.querySelector("#attachmentButton").addEventListener('click',() =>{
        choosePdf();
    });

    document.querySelector('#UplodadedFileClientName').addEventListener('blur', () => {
        setEmail(document.querySelector('#UplodadedFileClientName').value);
    });

    document.querySelector("#taxes").addEventListener('change', () => {
        checkTaxesbool(document.querySelector('#taxes').checked)
    });
}
