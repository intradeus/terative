<p align="center"><img src="https://github.com/intradeus/terative/blob/master/assets/logo.png?raw=true" width="120" height="120">

# **Terative**


``#Windows`` ``#MacOS`` ``#Français`` ``#English``

A pretty cool Electron (8.5.2) application to generate PDF receipts and send them to your clients via email **in less than 15 secondes**.
- Contains a client management system, to add, edit or remove clients informations.
- Settings to modify the personnal informations written on the receipt itself.
- Service management system, to easily add a service and it's related price.
- Taxes support, as well as all kinds of currencies.
- Email template, to send a customized email to your clients.
- Memory : the app grows as you add clients, automatically registering names and their linked email addresses, saves you time the more you use it.
- D A R K  &nbsp;&nbsp;  M O D E !!
- Everything is on your computer, nothing goes in the cloud, to keep your clients personnal informations secure.
- Backups and restoration of your clients
- Cancellation: made a mistake on your last receipt but don't want to delete it because it will look like fraud ? CANCEL IT !! It will add a "cancelled" message on your receipt and change its name.

# Screenshots :
### Main page : 
![Main page](https://github.com/intradeus/terative/blob/master/assets/sc1.png?raw=true)

### Settings :
![Settings example](https://github.com/intradeus/terative/blob/master/assets/sc2.png?raw=true)

### Clients management : 
![Clients management ](https://github.com/intradeus/terative/blob/master/assets/sc3.png?raw=true)

### Receipt created
![Receipt example](https://github.com/intradeus/terative/blob/master/assets/sc4.png?raw=true)


# Run it :

```
npm ci 

npm run start
```


# Build it yourself : 
### MACOS (can only build on MacOS only)
```
npm install
        
npm run build-macos
```
                
### WIN32 (requires windows-build-tools)
```
npm install
        
npm run build-win32
```
### WIN64: (requires windows-build-tools):
```
npm install
        
npm run build-win64
```
