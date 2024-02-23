import { useCallback } from 'react'
import { useLocalStories } from '../../../Components/LocalStories/LocalStoriesHooks.js'

import StoriesTable from './StoriesTable.js'

const {ipcRenderer} = window.require('electron')

function StoriesLocalContent ({setSelectedStories, selectedStories}) {
  const
    localStories = useLocalStories(),
    onEdit = useCallback(
      (story) => ipcRenderer.send('local-stories-update', [story]),
      []
    ),
    onEditSelected = useCallback(
      (stories) => ipcRenderer.send('local-stories-update', stories),
      []
    ),
    onDelete = useCallback(
      (stories) => ipcRenderer.send('local-stories-delete', stories),
      []
    )

  return <StoriesTable stories={localStories}
                       onEdit={onEdit}
                       onEditSelected={onEditSelected}
                       onDelete={onDelete}
                       setSelectedStories={setSelectedStories}
                       selectedStories={selectedStories}/>
}

export default StoriesLocalContent
