import { useEffect, useState } from 'react'
import { useElectronEmitter, useElectronListener } from '../Hooks/UseElectronEvent.js'
import ModalTaskVisualizer from '../../Modal/Templates/ModalTasksVisualizer/ModalTasksVisualizer.js'

function ModalElectronTaskVisualizer ({taskName, dataSent, onClose}) {
  const
    [downloadStarted, setDownloadStarted] = useState(false),
    [processingStory, setProcessingStory] = useState(null),
    [waitingStories, setWaitingStories] = useState([]),
    [errorStories, setErrorStories] = useState([]),
    [isClosable, setIsClosable] = useState(false)

  useElectronListener(
    taskName + '-task',
    (title, message, current, total) => {
      if (title === '' && message === '' && current === 0 && total === 0) {
        setProcessingStory(null)
      } else {
        setProcessingStory({task: title, message, current, total})
        setDownloadStarted(true)
      }
    },
    [setProcessingStory]
  )

  useElectronListener(
    taskName + '-waiting',
    (waitingStories) => setWaitingStories(waitingStories.map((s) => s.title)),
    [setWaitingStories]
  )

  useElectronListener(
    taskName + '-error',
    (item, error) => setErrorStories((errors) => ([
      ...errors,
      {
        task: item.title,
        message: error
      }
    ])),
    [setErrorStories]
  )

  useElectronEmitter(taskName, dataSent)

  useEffect(() => {
    if (downloadStarted && processingStory === null && !waitingStories.length) {
      if (!errorStories.length) {
        onClose()
      } else {
        setIsClosable(true)
      }
    } else {
      setIsClosable(false)
    }
  }, [downloadStarted, processingStory, waitingStories, errorStories, onClose, setIsClosable])

  return <ModalTaskVisualizer errorTasks={errorStories}
                              processingTask={processingStory}
                              waitingTasks={waitingStories}
                              isClosable={isClosable}
                              onClose={onClose}/>
}

export default ModalElectronTaskVisualizer
