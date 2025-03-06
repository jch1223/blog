import i18next from 'i18next'
import koKr from './lang/ko-kr';
import enUS from './lang/en-us'
import slateConfig from '~@/slate.config';

await i18next.init({
  lng: slateConfig.lang,
  fallbackLng: 'ko-KR',
  resources: {
    'ko-KR': {
      translation: koKr
    },
    'en-US': {
      translation: enUS
    }
  }
})

export default i18next;