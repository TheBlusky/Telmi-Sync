import {ipcMain} from 'electron'
import * as path from 'path'
import fs from 'fs'
import {initTmpPath} from './Helpers/AppPaths.js'
import runProcess from './Processes/RunProcess.js'
import {getTelmiSyncParams} from "./Processes/Helpers/TelmiSyncParams.js";

function mainEventPiperTTS(mainWindow) {
  ipcMain.on(
    'piper-convert',
    async (event, text) => {
      const params = getTelmiSyncParams()
      if (params.piper.voice === 'elevenlabs') {
        const mp3Path = path.join(initTmpPath(path.join('audios', Date.now().toString(36))), 'elevenlabs.mp3')
        mainWindow.webContents.send('piper-convert-task', 'tts-converting', 'elevenlabs-starting')
        try {

          const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${params.elevenlabs.voice}`, {
              method: 'POST',
              body: JSON.stringify({
                text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                  stability: 0.5,
                  similarity_boost: 0.5
                }
              }),
              headers: {
                'Content-Type': 'application/json',
                'xi-api-key': params.elevenlabs.apiKey
              }
            })
            if(!response.ok) {
              mainWindow.webContents.send('piper-convert-task', 'error', 'elevenlabs-error')
              mainWindow.webContents.send('piper-convert-task', '', '', 0, 0)
              console.log(JSON.stringify(await response.json()))
              return
            }
            mainWindow.webContents.send('piper-convert-task', 'tts-converting', 'elevenlabs-saving')
            const writeStream = fs.createWriteStream(mp3Path)
            const stream = new WritableStream({
                write(chunk) {
                  writeStream.write(chunk);
                },
              });
            await response.body.pipeTo(stream)
            mainWindow.webContents.send('piper-convert-task', 'tts-converting', 'elevenlabs-finished')
            mainWindow.webContents.send('piper-convert-task', '', '', 0, 0)
            mainWindow.webContents.send('piper-convert-succeed', mp3Path)
        } catch(e) {
          console.log(e)
          mainWindow.webContents.send('piper-convert-task', 'error', 'elevenlabs-error')
          mainWindow.webContents.send('piper-convert-task', '', '', 0, 0)
        }
      } else {
        const
            jsonPath = path.join(initTmpPath('json'), 'piper.json'),
            wavePath = path.join(initTmpPath(path.join('audios', Date.now().toString(36))), 'piper.wav')
        fs.writeFileSync(jsonPath, JSON.stringify({"text": text, "output_file": wavePath}))
        runProcess(
          path.join('PiperTTS', 'PiperTTS.js'),
          [jsonPath],
          () => {
            mainWindow.webContents.send('piper-convert-succeed', wavePath)
          },
          (message, current, total) => {
            mainWindow.webContents.send('piper-convert-task', 'tts-converting', message, current, total)
          },
          (error) => {
            mainWindow.webContents.send('piper-convert-task', 'error', error)
          },
          () => {
            mainWindow.webContents.send('piper-convert-task', '', '', 0, 0)
          }
        )
      }
    }
  )
}

export default mainEventPiperTTS
