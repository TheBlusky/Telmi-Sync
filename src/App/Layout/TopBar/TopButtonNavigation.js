import { useRouter } from '../../Router/RouterHooks.js'

import styles from './TopBar.module.scss'

function TopButtonNavigation ({buttonComponent, text, route, currentModule}) {
  const
    setRoute = useRouter(),
    isSelected = route.module === currentModule,
    Button = buttonComponent

  return <li className={[styles.buttonContainer, isSelected ? styles.buttonContainerSelected : ''].join(' ')}>
    <Button text={text}
            className={[styles.button, isSelected ? styles.buttonSelected : ''].join(' ')}
            onClick={() => setRoute(route)}/>
  </li>
}

export default TopButtonNavigation
