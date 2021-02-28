const localization = require('./translation/localization.js');

//General functions accross the pages
function setEditor(){
    tinymce.init({
        selector: 'textarea',
        content_css :"./styles/tinymce-style.css",
        menubar: false,
        plugins: "link",
        resize: true,
        width: "3000",
        height: "200",
        branding: false,
        elementpath: false,
        language: (LANG != "en_US") ? LANG:null,
        language_url: (LANG != "en_US") ? './js/translation/'+ LANG +'.js' : null,
        content_style: (store.get("dark-theme")) ? 'body { background-color:#303030; color : white;}':"",
        toolbar: ' bold italic underline fontsizeselect | link | alignleft aligncenter alignright alignjustify | outdent indent | undo redo refresh',
        setup: function (editor) {
            editor.ui.registry.addButton('refresh', {
                icon: 'restore-draft',
                tooltip: localization.getLocaleText("restoreTemplate", localization.appErrors),
                onAction: function (_) {
                    editor.resetContent("");
                    editor.insertContent(store.get('emailTemplate'));
                }
            });
        },
    });
}

function assignDarkTheme(){
    if(store.get("dark-theme") == true){
        document.getElementsByTagName("body")[0].className += " dark-theme";
    }
    else {
        document.getElementsByTagName("body")[0].className += " light-theme";
    }
}

function showMessage(success, message){
    hideElement("success");
    hideElement("danger");
    if(success){
        document.getElementById("successMessage").innerHTML = message;
        document.getElementById("success").classList.remove("hidden");
    } else {
        document.getElementById("dangerMessage").innerHTML = message;
        document.getElementById("danger").classList.remove("hidden");
    }
    
}

function hideElement(id){
    if(!document.getElementById(id).classList.contains("hidden"))
        document.getElementById(id).classList.add("hidden");
    
}

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

function showElement(id){
    if(document.getElementById(id).classList.contains("hidden"))
        document.getElementById(id).classList.remove("hidden");
}

exports.setEditor = setEditor;
exports.assignDarkTheme = assignDarkTheme;
exports.showMessage = showMessage;
exports.hideElement = hideElement;
exports.showElement = showElement;
exports.create_UUID = create_UUID;
