import {useCallback} from 'react'
import {useLocale} from '../../Components/Locale/LocaleHooks.js'
import {useModal} from '../../Components/Modal/ModalHooks.js'

import {routeSynchronize} from '../../Modules/Synchronize/Routes.js'
import {routeStores} from '../../Modules/Stores/Routes.js'
import {routeStudio} from '../../Modules/Studio/Routes.js'

import ButtonIconXMark from '../../Components/Buttons/Icons/ButtonIconXMark.js'
import ButtonIconWindow from '../../Components/Buttons/Icons/ButtonIconWindow.js'
import ButtonIconTextArrowLeftRight from '../../Components/Buttons/IconsTexts/ButtonIconTextArrowLeftRight.js'
import ButtonIconTextStore from '../../Components/Buttons/IconsTexts/ButtonIconTextStore.js'
import ButtonIconTextMicrophone from '../../Components/Buttons/IconsTexts/ButtonIconTextMicrophone.js'
import ButtonIconGear from '../../Components/Buttons/Icons/ButtonIconGear.js'
import TopButtonNavigation from './TopButtonNavigation.js'
import ButtonLangChooser from '../../Components/Locale/ButtonLangChooser.js'
import ButtonUpdate from './ButtonUpdate.js'

import LogoTelmi from '../../Assets/Images/logo-telmi.svg'

import styles from './TopBar.module.scss'
import ModalTelmiSyncParamsForm from '../../Modules/TelmiSyncParams/ModalTelmiSyncParamsForm.js'

const {ipcRenderer} = window.require('electron')

function TopBar({currentModule}) {
  const
    {getLocale} = useLocale(),
    {addModal, rmModal} = useModal(),
    onChangeSize = useCallback(() => ipcRenderer.send('change-size'), []),
    onClose = useCallback(() => ipcRenderer.send('close'), []),
    onParameters = useCallback(
      () => {
        addModal((key) => {
          const modal = <ModalTelmiSyncParamsForm key={key}
                                                  onClose={() => rmModal(modal)}/>
          return modal
        })
      },
      [addModal, rmModal]
    )

  return <div className={styles.container}>
    <div className={styles.navigation}>
      <img src={LogoTelmi} className={styles.logo} alt="Telmi logo"/>
      <ul className={[styles.buttons, styles.buttonsNavigation].join(' ')}>
        <TopButtonNavigation buttonComponent={ButtonIconTextArrowLeftRight}
                             text={getLocale('synchronize')}
                             route={routeSynchronize}
                             currentModule={currentModule}/>
        <TopButtonNavigation buttonComponent={ButtonIconTextStore}
                             text={getLocale('stores')}
                             route={routeStores}
                             currentModule={currentModule}/>
        <TopButtonNavigation buttonComponent={ButtonIconTextMicrophone}
                             text={getLocale('studio')}
                             route={routeStudio}
                             currentModule={currentModule}/>
      </ul>
    </div>
    <ul className={styles.buttons}>
      <li><ButtonUpdate/></li>
      <li><ButtonLangChooser/></li>
      <li><ButtonIconGear title={getLocale('telmi-sync-params')}
                          onClick={onParameters}/></li>
      <li><ButtonIconWindow title={getLocale('maximize-window')}
                            onClick={onChangeSize}/></li>
      <li><ButtonIconXMark title={getLocale('close-app')}
                           onClick={onClose}/></li>
    </ul>
  </div>
}

export default TopBar
