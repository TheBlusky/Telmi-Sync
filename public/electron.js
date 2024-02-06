import { app, BrowserWindow, Menu } from 'electron'
import isDev from 'electron-is-dev'
import mainEventWindow from './MainEvents/Window.js'
import mainEventImport from './MainEvents/Import.js'
import mainEventDownloadFFmpeg from './MainEvents/DownloadFFmpeg.js'
import mainEventLocalStoriesReader from './MainEvents/LocalStories.js'
import mainEventLocalMusicReader from './MainEvents/LocalMusic.js'
import mainEventStores from './MainEvents/Stores.js'

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile('build/index.html')
  }
  Menu.setApplicationMenu(null)

  mainEventWindow(mainWindow)
  mainEventImport(mainWindow)
  mainEventDownloadFFmpeg(mainWindow)
  mainEventLocalStoriesReader(mainWindow)
  mainEventLocalMusicReader(mainWindow)
  mainEventStores(mainWindow)

  //mainWindow.on('closed', () => {})

  return mainWindow
}

function initApp () {
  let mainWindow = null

  const setWindow = () => {
    if (!(mainWindow instanceof BrowserWindow)) {
      mainWindow = createWindow()
    }
  }

  app.on('ready', setWindow)
  app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())
  app.on('activate', () => BrowserWindow.getAllWindows().length === 0 && setWindow())
}

initApp()
