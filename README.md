Electron application to generate PDF receipts and directly send them to your clients via email
-- with a client management system
-- settings to modify the personnal informations written on the receipt itself
-- service management system, to easily add a service and it's related price
-- Email templates, to send a customized email to each of your clients


Application Electron pour générer un reçu en PDF et directement l'envoyer à vos clients par email
-- Inclus un gestionnaire de clients
-- Des réglages pour modifier les informations personnelles rédigées sur le reçu
-- un gestionnaire de services, pour facilement rajouter un service et son prix
-- Des patrons d'email, pour envoyer des emails personnalisés à vos clients

# MACOS 
        1) REBUILD PACKAGES :
                npm run rebuild-packages-mac
        2) PACKAGE APP :
                npm run package-mac
        3) CREATE INSTALLER (.DMG)
                npm run installer-mac

# WIN32
(requires windows-build-tools):

        1) REBUILD PACKAGES :
                npm run rebuild-packages-win
        2) PACKAGE APP :
                npm run package-win32
        3) CREATE INSTALLER (.DMG)
                npm run installer-win32

# WIN64:
(requires windows-build-tools):

        1) REBUILD PACKAGES :
                npm run rebuild-packages-win
        2) PACKAGE APP :
                npm run package-win64
        3) CREATE INSTALLER (.DMG)
                npm run installer-win64
