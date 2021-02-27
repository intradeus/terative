// STORE UPDATES BETWEEN VERSIONS 

function updateBetweenVersions(){
    if(store.get("version") === undefined || store.get("version") < 40){
        createBackup();
        store.set("version", 40);
        var oldClients = store.get('cachedClients');
        var newClients = []
        oldClients.forEach(client => {
            newClients.push(
            {
                "name": client.name,
                "email": client.email,
                "id": general.create_UUID
            });
        });

        store.set('cachedClients',newClients);
    }
    if(store.get("version") === undefined || store.get("version") < 41){
        createBackup()
        store.set("version", 41);
        LANG = "fr_FR";
        store.set("lang","fr_FR");
    }
    console.log("version : " + store.get("version"));
}

function createBackup(){
    var backupStorePath = store.path;
    backupStorePath = backupStorePath.replace(".json","");
    backupStorePath += "_backup.json"

    // File destination.txt will be created or overwritten by default.
    fsystem.copyFile(store.path, backupStorePath, (err) => {
    if (err) 
        general.showMessage(false, err)
    else 
        console.log('store config.json was copied to config_backup.json');
    });
}

exports.updateBetweenVersions = updateBetweenVersions;
exports.createBackup = createBackup;
