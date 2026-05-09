// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import as from './locales/assamese.json';
import bn from './locales/bengali.json';
import brx from './locales/bodo.json';
import doi from './locales/dogri.json';
import gu from './locales/gujarati.json';
import kn from './locales/kannada.json';
import ks from './locales/kashmiri.json';
import kok from './locales/konkani.json';
import mai from './locales/maithili.json';
import ml from './locales/malayalam.json';
import mni from './locales/manipuri.json';
import mr from './locales/marathi.json';
import ne from './locales/nepali.json';
import or from './locales/odia.json';
import pa from './locales/punjabi.json';
import sa from './locales/sanskrit.json';
import sat from './locales/santali.json';
import sd from './locales/sindhi.json';
import ta from './locales/tamil.json';
import te from './locales/telugu.json';
import ur from './locales/urdu.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  as: { translation: as },
  bn: { translation: bn },
  brx: { translation: brx },
  doi: { translation: doi },
  gu: { translation: gu },
  kn: { translation: kn },
  ks: { translation: ks },
  kok: { translation: kok },
  mai: { translation: mai },
  ml: { translation: ml },
  mni: { translation: mni },
  mr: { translation: mr },
  ne: { translation: ne },
  or: { translation: or },
  pa: { translation: pa },
  sa: { translation: sa },
  sat: { translation: sat },
  sd: { translation: sd },
  ta: { translation: ta },
  te: { translation: te },
  ur: { translation: ur },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      // i18next-browser-languagedetector could be added, but we rely on localStorage
    },
  });

export default i18n;
