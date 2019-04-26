const { app, BrowserWindow } = require('electron')
const url = require('url')
const path = require('path')

let win

function createWindow() {
    win = new BrowserWindow({ width: 1024, height: 800 })
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
    win.setResizable(false);

    /* win.openDevTools(); */
    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

const ipc = require('electron').ipcMain;
const os = require('os');
const { dialog } = require('electron');

ipc.on('open-file-dialog-for-file', function (event) {
    if (os.platform() == 'linux' || os.platform() == 'win32') {
        dialog.showOpenDialog({
            filters: [{
             name:'xlsx' ,   extensions: ['xlsx']
            }
            ],
            properties: ['openFile']
        }, function (files) {
            if (files) {
                const excelToJson = require('convert-excel-to-json');
                const result = excelToJson({
                    sourceFile: files[0]
                });
                event.sender.send('selected-file', result);
            }
        });
    } else {
        dialog.showOpenDialog({
            properties: ['openFile', 'openDirectory']
        }, function (files) {

            if (files) {
                const excelToJson = require('convert-excel-to-json');
                const result = excelToJson({
                    sourceFile: files[0]
                });
                event.sender.send('selected-file', result);
            }
        });
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})