//Localization function
//LABELS OBJECTS : [documentID, localisation key]
function setLocaleText(pageName) {
    var idsLabel = [];
    var idsLang = [];

    if(pageName == "settings") {
        idsLabel = [["settingsTitle","settings"],["generalTabLabel","info"],["emailTabLabel","sendEmailTitle"],["servicesTabLabel","servicesList"],
        ["taxesTabLabel","taxCurrencyTab"],["settingsTabLabel","settings"],["sellerNameLabel","completeName"],["sellerTitleLabel","sellerTitle"],
        ["registrationIDLabel","sellerId"],["sellerAddressLabel","sellerAddress"],["sellerPhoneLabel","phone"],["sellerEmailLabel","email"],
        ["filepathLabel","folderSave"],["chooseDirectory","choose"],["signatureLabel","signature"],["chooseSignature","choose"],
        ["sendingEmailLabel","sendingEmail"],["emailsmtpLabel","smtpServer"],["emailPasswordLabel","password"],
        ["subjectTemplateLabel","subjectTemplate"],["emailTemplateLabel","emailTemplate"],["serviceLabel","serviceName"],["priceLabel","price"],
        ["taxLabel","taxName"],["percentageLabel","percentage"],["taxIdLabel","taxId"],["themeLabel","themeLabel"],["languageLabel","languageLabel"],
        ["taxesTabTaxesCategory","taxes"],["taxesTabCurrencyCategory","currency"],["currencyMainName","currencyMainUnit"],["currencySubName","currencySubUnit"],
        ["currencyCode","currencyCode"], ["currencySign","currencySign"],["signPlacement","signPlacement"],["currencyBefore","currencyBefore"],
        ["currencyAfter","currencyAfter"],["currencySignValue","currencySignPlaceholder"],["currencyCodeValue","currencyCodePlaceholder"],
        ["currencySubValue","currencySubUnitPlaceholder"],["currencyMainValue","currencyMainUnitPlaceholder"], ["importExportLabel","importExportLabel"],
        ["exportButton","exportButton"],["importButton","importButton"], ["restoreButton","restoreButton"], ["lastBakupText","lastBakupText"],
        ["openCurrentConfigFile","openCurrentConfigFile"],["openBackupConfigFile","openBackupConfigFile"],["createBackup","createBackup"]];

        idsLang = [["dropdownMenuLanguage",LANG]];
    }

    if(pageName == "index"){
        idsLabel = [["titleCreate","titleCreate"],["taxesCheck","taxes"],["receiptNumberTitle","receiptNumberTitle"],["create","titleCreate"],
        ["sendEmailTitle","sendEmailTitle"],["attachmentName","attachment"],["attachmentButton","selectFile"],["sendEmail","sendEmail"],
        ["clientName","clientName"],["service","service"],["unitPriceNumber","price"],["date","date"],["receiptNumber","receiptNumber"],
        ["UplodadedFileDate","date"],["clientEmail","clientEmail"],["emailSubject","emailSubject"],["UplodadedFileClientName","clientName"],
        ["cancelPDF","cancelPdf"]];
    }

    if(pageName == "clients"){
        idsLabel = [["clientsTitle","clientsTitle"],["addClient","add","<em class='ml-2 fa fa-plus'></em>"],["searchClient","search"]];
    }

    idsLabel.forEach(pair => {
        if(document.getElementById(pair[0]).tagName != "INPUT"){
            document.getElementById(pair[0]).innerHTML= getLocaleText(pair[1], appText);
            if(pair[2]){
                document.getElementById(pair[0]).innerHTML+= pair[2];
            }
        } else {
            document.getElementById(pair[0]).placeholder = getLocaleText(pair[1], appText);
        }
    });

    idsLang.forEach(pair => {
        if(document.getElementById(pair[0]).tagName != "INPUT"){
            document.getElementById(pair[0]).innerHTML= getLocaleText(pair[1], appLanguages);
        } else {
            document.getElementById(pair[0]).placeholder = getLocaleText(pair[1], appLanguages);
        }
    });
}

function getLocaleText(key, array){
    var index = langIds.indexOf(LANG);

    for(var i = 0; i < array.length; i++){
        if(array[i][0] == key) {
            return array[i][index].toString();
        }
    }
    return "";
}

var langIds = ['key','fr_FR','en_US'];
var appText = [
    ["appName", "Terative", "Terative"],
    ["titleCreate", "Créer un reçu","Create a receipt"],
    ["clientName", "Nom du client","Name of the client"],
    ["service", "Service","Service"],
    ["price", "Prix","Price"],
    ["date", "Date","Date"],
    ["receiptNumber", "Numero du reçu","Receipt's number"],
    ["clientEmail", "Email du client","Client's email"],
    ["emailSubject", "Sujet de l'email","Email's subject"],
    ["receiptNumberTitle", "Reçu #","Receipt #"],
    ["sendEmailTitle", "Envoi par courriel","Mailing"],
    ["attachment", "Fichier joint : ","Attachment : "],
    ["sendEmail", "Envoyer le courriel","Send email"],
    ["selectFile", "Choisir un fichier","Choose a file"],
    ["taxes", "Taxes","Taxes"],
    ["taxCurrencyTab","Taxes et devise","Taxes and currency"],
    ["settings", "Réglages","Settings"],
    ["backButton", "Retour","Back"],
    ["servicesList", "Services et produits","Services and products"],
    ["completeName", "Nom Complet","Complete name"],
    ["sellerTitle", "Profession et/ou titres","Profession and/or titles"],
    ["sellerId", "Numéro d'identification","Identification number"],
    ["sellerAddress", "Adresse de travail","Work address"],
    ["phone", "Numéro de téléphone","Phone number"],
    ["email", "Courriel","Email"],
    ["folderSave", "Dossier d'enregistrement","Save folder"],
    ["choose", "Choisir","Choose"],
    ["signature", "Signature","Signature"],
    ["sendingEmail", "Courriel d'envoi","Sending email"],
    ["smtpServer", "Serveur SMTP","SMTP server"],
    ["password", "Mot de passe","Password"],
    ["subjectTemplate", "Sujet du courriel modèle","Subject of email template"],
    ["emailTemplate", "Courriel modèle","Email template"],
    ["serviceName", "Nom du service","Service's name"],
    ["taxName", "Nom de la taxe","Tax's name"],
    ["percentage", "Pourcentage","Percentage"],
    ["taxId", "ID de la taxe","Tax's ID"],
    ["clientsTitle","Clients","Clients"],
    ["add","Ajouter","Add"],
    ["search","Recherche ...","Search ..."],
    ["info","Informations","Informations"],
    ["showPdf","Ouvrir le reçu ","Open receipt "],
    ["of"," de "," of "],
    ["cancelPdf","Annuler un reçu","Cancel a receipt"],
    ["cancelled","ANNULÉ","CANCELLED"],
    ["receipt","reçu ","receipt "],
    ["languageLabel","Langue","Language"],
    ["themeLabel","Thème","Theme"],
    ["currency","Devise","Currency"],
    ["currencyMainUnit","Unité principale", "Main unit"],
    ["currencyMainUnitPlaceholder","dollars, yens ...","dollars, yens ..."],
    ["currencySubUnit","Sous-unité", "Subunit"],
    ["currencySubUnitPlaceholder","cents, sen ...","cents, sen ..."],
    ["currencyCode","Code de la devise", "Currency Code"],
    ["currencyCodePlaceholder","USD, JPY ...","USD, JPY ..."],
    ["currencySign","Signe de la devise", "Currency sign"],
    ["currencySignPlaceholder","$, ¥ ...","$, ¥ ..."],
    ["signPlacement","Placement du signe","Sign placement"],
    ["currencyAfter","Après","After"],
    ["currencyBefore","Avant","Before"],
    ["importExportLabel","Exporter et importer le fichier client","Export and import the client's file"],
    ["exportButton","Exporter le fichier","Export file"],
    ["importButton","Importer un fichier","Import file"],
    ["restoreButton","Restaurer la dernière sauvegarde","Restore last backup"],
    ["lastBakupText","Dernière sauvegarde : ","Last backup : "],
    ["openCurrentConfigFile","Ouvrir le fichier actuel", "Open current file"],
    ["openBackupConfigFile","Ouvrir le fichier de sauvegarde","Open backup fule"],
    ["createBackup","Créer une sauvegarde","Create a backup"]
];

var appErrors = [
    ["invalidDirectory","Dossier invalide","Invalid directory"],
    ["saveModifTitle","Enregistrer les modification","Save modifications"],
    ["saveModifOption1","Enregistrer","Save"],
    ["saveModifOption2","Ne pas enregistrer","Don't save"],
    ["saveModifOption3","Annuler","Cancel"],
    ["saveModifText","Voulez-vous enregistrer vos modifications ?","Do you want to save your modifications ?"],
    ["irreversibleActionMessage","Cette action est irréversible.","This action is irreversible"],
    ["taxNeededTitle","Aucune taxe paramétrée","No tax has been entered"],
    ["ok","Ok","Ok"],
    ["and"," et "," and "],
    ["taxNeededText","Aucune taxe n'a été paramétrée. Allez dans les réglages pour rajouter une taxe","No tax has been set. Please go in the settings to add a tax"],
    ["enterClientName","Veuillez rentrer le nom d'un client","Please enter a client's name"],
    ["selectService","Veuillez sélectionner un service","Please select a service"],
    ["selectDate","Veuillez sélectionner une date","Please select a date"],
    ["successPdfCreation","Fichier PDF créé avec succès","PDF file successfully created"],
    ["invalidFile","Fichier invalide","Invalid file"],
    ["cancelReceiptTitle","Annuler un reçu","Cancel a receipt"],
    ["cancelReceiptOption1","Annuler un ancien reçu","Cancel an older receipt"],
    ["cancelReceiptOption2","Annuler ","Cancel "],
    ["cancelReceiptText","Voulez-vous annuler un reçu anciennement créé ou le dernier reçu créé ","Would you like to delete an older receipt or the last one created "],
    ["invalidChoice","Choix invalide","Invalid choice"],
    ["yes","Oui","Yes"],
    ["no","Non","No"],
    ["confirmCancellationText1","Êtes-vous sûr de vouloir annuler le reçu : ","Are youu sure to delete the receipt : "],
    ["confirmCancellationText2","? Cette action est irréversible", "? This action is irreversible"],
    ["successCancellation","Reçu annulé avec succès","Receipt successfully cancelled"],
    ["emailPasswordMissing","Mot de passe email manquant ou inaccessible","Email password missing or inaccessible"],
    ["clientEmailMissing","Email du client manquant","Client's email is missing"],
    ["emailSubjectMissing","Sujet de l'email manquant","Email's subject missing"],
    ["sendingEmailMissing","Email d'envoi manquant","Sending email missing"],
    ["invalidLogin1","Email / Mot de passe invalide. Assurez-vous aussi d'avoir activé ","Invalid email/password. Make sure you have activated "],
    ["invalidLogin2","<a style='color: blue; text-decoration: underline; cursor : pointer' onclick='openSecureAppInBrowser()'>cette option</a>","<a style='color: blue; text-decoration: underline; cursor : pointer' onclick='openSecureAppInBrowser()'>this option</a>"],
    ["emailTimeout","Requête annulée : temps d'attente trop long. Verifiez que le serveur SMTP est correct","Request cancelled : timeout. Make sure the SMTP server is correct"],
    ["invalidEmailRecipient","Requête annulée : Email du destinataire invalide","Request cancelled: invalid recipient email"],
    ["successEmail","Votre email a bien été envoyé à ", "Your email has been successfully sent to "],
    ["failReplaceDate","La date n'a pas pu être remplacée dans le mail/sujet", "Date could not be replaced in the email/subject"],
    ["failReplaceClientName","Le nom du client n'a pas pu être remplacée dans le mail/sujet", "Client's name could not be replaced in the email/subject"],
    ["invalidFilePath","Le dossier dans lequel vous voulez enregistrer le reçu n'existe pas","The directory in which you want to save receipts doesn't exist"],
    ["addClientTitle", "Ajouter un client ", "Add a client"],
    ["addClientName", "(Obligatoire) Nom complet :", "(Mandatory) Complete name :"],
    ["clientAlreadyExists", "Ce client existe déjà", "This client already exists"],
    ["addClientEmail","(Facultatif) Adresse email pour : ", "(Optional) Email address for : "],
    ["clientAddedSuccess","Client ajouté avec succès","Client successfully added"],
    ["restoreTemplate","Restorer le modèle","Restore template"],
    ["successfulImport","Fichier de configuration importé avec succès", "Config file successfully imported"],
    ["successfulExport","Fichier de configuration exporté avec succès", "Config file successfully exported"]
];

var appLanguages = [
    ["fr_FR", "Français","Français"],
    ["en_US", "English","English"],
]

exports.setLocaleText = setLocaleText;
exports.getLocaleText = getLocaleText;
exports.appLanguages = appLanguages;
exports.appText = appText;
exports.appErrors = appErrors;

