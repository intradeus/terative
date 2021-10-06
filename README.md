<p align="center"><img src="https://github.com/intradeus/terative/blob/master/assets/logo.png?raw=true" width="120" height="120">

# **Terative**


``#Windows`` ``#MacOS`` ``#Français`` ``#English``

A pretty cool Electron (8.5.2) application to generate PDF receipts and send them to your clients via email **in less than 15 secondes**.
- Contains a client management system
- Settings to modify the personnal informations written on the receipt itself
- Service management system, to easily add a service and it's related price
- Email template, to send a customized email to your clients
- D A R K  &nbsp;&nbsp;  M O D E !!


# Screenshots :
### Main page : 
![Main page](https://github.com/intradeus/terative/blob/master/assets/sc1.png?raw=true)

### Settings :
![Settings example](https://github.com/intradeus/terative/blob/master/assets/sc2.png?raw=true)

### Clients management : 
![Clients management ](https://github.com/intradeus/terative/blob/master/assets/sc3.png?raw=true)

### Receipt created
![Receipt example](https://github.com/intradeus/terative/blob/master/assets/sc4.png?raw=true)

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
