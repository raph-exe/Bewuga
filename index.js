const electron = require('electron');
const { app, BrowserWindow, ipcMain, shell, dialog, Menu } = electron;
const fs = require('fs');
const axios = require('axios');
var videoshow = require('videoshow')

var mainWindow;
var addDialog;
var renderDialog;
var patheee;

var videoOptions = {
  fps: 25,
  loop: 1,
  transition: false,
  transitionDuration: 2,
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '640x?',
  audioBitrate: '128k',
  audioChannels: 2,
  format: 'mp4',
  pixelFormat: 'yuv420p'
}

var audioParams = {
  fade: false,
  delay: 0
}


app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    resizable: false,
    title: 'Bewuga'
  });
  mainWindow.setMenu(null);
  mainWindow.loadFile('index.html');
  mainWindow.on('closed', () => {
    app.quit();
  })
});

const download_image = (url, image_path) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(image_path))
          .on('finish', () => resolve())
          .on('error', e => reject(e));
      }),
  );

ipcMain.on('message', (event, arg1, arg2, arg3, arg4, arg5) => {
  if (arg1 == 'AddMsg') {
    addDialog = new BrowserWindow({
      width: 400,
      height: 250,
      resizable: false,
      minimizable: false,
      title: 'Add Message',
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true
      }
    });
    addDialog.setMenu(null);
    addDialog.loadFile('add.html');
  }
  if (arg1 == 'Render') {
    renderDialog = new BrowserWindow({
      width: 400,
      height: 250,
      resizable: false,
      minimizable: false,
      title: 'Render',
      webPreferences: {
        contextIsolation: false,
        nodeIntegration: true
      }
    });
    renderDialog.setMenu(null);
    renderDialog.loadFile('render.html');
  }
  if(arg1 == 'add') {
    addDialog.close();
    const username = arg2;
    const avatar = arg3;
    const message = arg4;
    const baseUrl = `https://api-monkedev.herokuapp.com/canvas/fakequote?imgUrl=${avatar}&text=${message}&username=${username}`;
    mainWindow.webContents.send('add', baseUrl);
  }
  if(arg1 == 'select-output') {
    dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select Output Folder',
      buttonLabel: 'Select'
    }).then(result => {
      if(result.filePaths[0]) {
        event.reply('selected', result.filePaths[0]);
      }
    })
  }
  if(arg1 == 'export') {
    renderDialog.close();
    patheee = arg2;
    mainWindow.webContents.send('dataImport');
  }
  if(arg1 == 'dataImport1') {
    const images = arg2;
    let countt = 0;
    images.forEach(img => {
      download_image(img,`${patheee}\\${countt}.png`);
      countt++;
    });
    download_image('https://media.vocaroo.com/mp3/1fH9n2NrTnLm',`${patheee}\\notification.mp3`);
    const imagePaths = [];
    for (let i = 0; i < images.length; i++) {
      imagePaths.push(`${patheee}\\${i}.png`);
    }
    videoshow(imagePaths, videoOptions).save(`${patheee}\\output.mp4`).on('error' , (e) => {
      dialog.showErrorBox('Render failed', 'Something went wrong');
      console.log(e);
    }).on('end', () => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Success',
        message: 'Export Successful',
        buttons: ['OK']
      });
    })
  }
})