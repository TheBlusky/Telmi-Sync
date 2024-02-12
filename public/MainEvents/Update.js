import { app, ipcMain } from 'electron'
import { requestJson } from './Helpers/Request.js'
import { isNewerVersion } from './Helpers/Version.js'

function mainEventUpdate (mainWindow) {
  ipcMain.on(
    'check-update',
    async () => {
      const json = await requestJson('https://api.github.com/repos/DantSu/Telmi-Sync/releases', {})
      if (!json.length || !isNewerVersion(app.getVersion(), json[0].tab_name)) {
        return
      }
      mainWindow.webContents.send('check-update-data', json[0].html_url)
    }
  )
}

export default mainEventUpdate
