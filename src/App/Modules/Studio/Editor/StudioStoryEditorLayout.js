import {useCallback} from 'react'
import {useLocale} from '../../../Components/Locale/LocaleHooks.js'
import {useModal} from '../../../Components/Modal/ModalHooks.js'
import {useStudioStory, useStudioStoryUpdater} from './Providers/StudioStoryHooks.js'

import StudioStoryEditorGraphContainer from './Graph/StudioStoryEditorGraphContainer.js'
import ButtonIconXMark from '../../../Components/Buttons/Icons/ButtonIconXMark.js'
import ButtonIconFloppyDisk from '../../../Components/Buttons/Icons/ButtonIconFloppyDisk.js'
import ButtonIconWand from '../../../Components/Buttons/Icons/ButtonIconWand.js'
import ModalStudioStorySaveConfirm from './ModalStudioStorySaveConfirm.js'
import StudioForms from './Forms/StudioForms.js'
import Loader from '../../../Components/Loader/Loader.js'

import styles from './StudioStoryEditor.module.scss'
import {useStudioForm} from './Providers/StudioStageHooks.js'
import ButtonIconPlay from '../../../Components/Buttons/Icons/ButtonIconPlay.js'


function StudioStoryEditorLayout({closeEditor}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    {setForm} = useStudioForm(),
    story = useStudioStory(),
    {updateStory, clearStoryUpdated, isStoryUpdated} = useStudioStoryUpdater(),
    loading = story === null,
    onEditItems = useCallback(() => setForm('form-inventory'), [setForm]),
    onSave = useCallback(
      () => {
        if (!isStoryUpdated) {
          return
        }
        clearStoryUpdated()
      },
      [clearStoryUpdated, isStoryUpdated]
    ),
    onClose = useCallback(
      () => {
        if (!isStoryUpdated) {
          return closeEditor()
        }

        addModal((key) => {
          const modal = <ModalStudioStorySaveConfirm key={key}
                                                     story={story.metadata}
                                                     onConfirm={() => {

                                                     }}
                                                     onClose={() => {
                                                       rmModal(modal)
                                                       closeEditor()
                                                     }}/>
          return modal
        })
      },
      [isStoryUpdated, addModal, closeEditor, story, rmModal]
    ),
    onTitleBlur = useCallback(
      (e) => {
        if (loading) {
          return
        }
        updateStory((sd) => ({
          ...sd,
          metadata: {...sd.metadata, title: e.target.value},
        }))
      },
      [loading, updateStory]
    )

  return <div className={styles.container}>
    <div className={styles.topBar}>
      <input type="text"
             defaultValue={!loading ? story.metadata.title : ''}
             className={styles.titleInput}
             onBlur={onTitleBlur}/>
      <ul className={styles.topBarButtons}>
        {!loading ? <>
          <li>
            <ButtonIconWand
              className={styles.topBarButton}
              title={getLocale('inventory')}
              onClick={onEditItems}/>
          </li>
          <li>
            <ButtonIconPlay
              className={styles.topBarButton}
              title={getLocale('story-play')}
              onClick={onEditItems}/>
          </li>
          <li>
            <ButtonIconFloppyDisk
              className={[styles.topBarButton, !isStoryUpdated ? styles.topBarButtonDisabled : ''].join(' ')}
              title={getLocale('save')}
              onClick={onSave}/>
          </li>
        </> : null}
        <li>
          <ButtonIconXMark className={styles.topBarButton}
                           title={getLocale('story-close')}
                           onClick={onClose}/>
        </li>
      </ul>
    </div>
    <div className={styles.content}>{
      loading ? <Loader/> : <>
        <StudioStoryEditorGraphContainer/>
        <StudioForms/>
      </>
    }
    </div>
  </div>
}

export default StudioStoryEditorLayout