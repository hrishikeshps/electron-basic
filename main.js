const { app, BrowserWindow, ipcMain, nativeTheme, Menu, MenuItem, dialog } = require('electron')
const path = require('path')

function createWindow() {
   const isMac = process.platform == 'darwin';

   const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
         preload: path.join(__dirname, 'preload.js')
      }
   })

   win.loadFile('index.html')

   ipcMain.handle('dark-mode:toggle', () => {
      if (nativeTheme.shouldUseDarkColors) {
         nativeTheme.themeSource = 'light';
      } else {
         nativeTheme.themeSource = 'dark';
      }
      return nativeTheme.shouldUseDarkColors
   })

   ipcMain.handle('dark-mode:system', () => {
      nativeTheme.themeSource = 'system'
   })

   ipcMain.handle('update-menu:user', () => {
      Menu.getApplicationMenu().getMenuItemById('custom-1').label = 'Custom Label Updated';
      Menu.getApplicationMenu().getMenuItemById('custom-1').submenu = [
         {
            label: 'New 1'
         },
         {
            label: 'New 2'
         },
      ];

      const updMenu = Menu.getApplicationMenu().items;
      const menu = Menu.buildFromTemplate(updMenu);
      Menu.setApplicationMenu(menu);
   })

   const template = [
      {
         label: 'View',
         id: 'view-1',
         submenu: [
            {
               role: 'reload'
            },
            {
               role: 'toggledevtools'
            },
            {
               type: 'separator'
            }
         ]
      },
      {
         label: 'File',
         submenu: [
           isMac ? { role: 'close' } : { role: 'quit' }
         ]
       },

      {
         role: 'window',
         id: 'window-1',
         submenu: [
            {
               role: 'minimize'
            },
            {
               role: 'close'
            }
         ]
      },

      {
         role: 'custom',
         id: 'custom-1',
         label: 'Custom Menu',
         submenu: [
            {
               label: 'Increase Count',
               click: function (item, focusedWindow) {
                  if (focusedWindow) {
                     //  const options = {
                     //    type: 'info',
                     //    title: 'Application Menu Demo',
                     //    buttons: ['Ok'],
                     //    message: 'This demo is for the Menu section, showing how to create a clickable menu item in the application menu.'
                     //  }
                     //  dialog.showMessageBox(focusedWindow, options, function () {})
                     win.webContents.send('update-counter', 1)
                  }
               }
            },
            {
               label: 'Descrease Count',
               click: function (item, focusedWindow) {
                  if (focusedWindow) {
                     win.webContents.send('update-counter', -1)
                  }
               }
            }
         ]
      }
   ]

   const menu = Menu.buildFromTemplate(template)
   Menu.setApplicationMenu(menu)
}

app.whenReady().then(() => {
   createWindow()

   app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
         createWindow()
      }
   })
})

app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') {
      app.quit()
   }
})

