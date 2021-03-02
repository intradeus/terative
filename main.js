// Modules to control application life and create native browser window
const {app, BrowserWindow , Menu} = require('electron')
const path = require('path')
require('dotenv').config();
const Store = require('electron-store');  
const store = new Store();

function createWindow () {
  //Menu.setApplicationMenu(false);
  const mainWindow = new BrowserWindow({
    width: 930,
    height: 850,
    minWidth: 930,
    minHeight: 390,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    },
    icon: './assets/logo.png'
  })
  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})