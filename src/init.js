import i18next from 'i18next';
import resources from '../locales/index.js';
import app, { modelState } from './app.js';

export default () => {
  const i18n = i18next.createInstance();
  i18n
    .init({
      lng: modelState.language,
      debug: true,
      resources,
    })
    .then(() => {
      app(i18n);
    });
};
