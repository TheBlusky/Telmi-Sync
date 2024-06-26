import { useRef } from 'react'
import { useLocale } from '../../../Components/Locale/LocaleHooks.js'
import ModalLayoutPadded from '../../../Components/Modal/ModalLayoutPadded.js'
import ButtonsContainer from '../../../Components/Buttons/ButtonsContainer.js'
import ButtonIconTextCheck from '../../../Components/Buttons/IconsTexts/ButtonIconTextCheck.js'
import InputText from '../../../Components/Form/Input/InputText.js'
import ModalTitle from '../../../Components/Modal/ModalTitle.js'
import ModalContent from '../../../Components/Modal/ModalContent.js'
import Form from '../../../Components/Form/Form.js'

function ModalStoreFormAdd ({onValidate, onClose}) {
  const
    {getLocale} = useLocale(),
    nameRef = useRef(),
    urlRef = useRef()

  return <ModalLayoutPadded isClosable={true}
                            onClose={onClose}>
    <ModalTitle>{getLocale('store-add')} :</ModalTitle>
    <Form>{
      (validation) => {
        return <>
          <ModalContent>
            <InputText label={getLocale('name')}
                       key="store-name"
                       id="store-name"
                       required={true}
                       ref={nameRef}/>
            <InputText label={getLocale('url')}
                       key="store-url"
                       id="store-url"
                       type="url"
                       required={true}
                       ref={urlRef}/>
          </ModalContent>
          <ButtonsContainer>
            <ButtonIconTextCheck text={getLocale('save')}
                                 rounded={true}
                                 onClick={() => {
                                   validation(
                                     [nameRef, urlRef],
                                     (values) => {
                                       onValidate({
                                         name: values[0],
                                         url: values[1],
                                       })
                                       onClose()
                                     }
                                   )
                                 }}/>
          </ButtonsContainer>
        </>
      }
    }</Form>
  </ModalLayoutPadded>
}

export default ModalStoreFormAdd
