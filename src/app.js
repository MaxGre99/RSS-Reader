import * as yup from 'yup';
import view from './view.js';
import downloader from './downloader.js';

// Model
const modelState = {
  field: {
    lastAddedURL: '',
  },
  language: 'ru',
  error: '',
  updatingIsOn: false,
  data: {
    feeds: [],
    posts: [],
    urls: [],
  },
};

export { modelState };

export default (i18n) => {
  const i18nToView = i18n;

  const elements = {
    input: document.querySelector('#url-input'),
    submitButton: document.querySelector('[type="submit"]'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    form: document.querySelector('form'),
    statusField: document.querySelector('.feedback'),
  };

  const validate = (fields, existingURLs) => {
    const schema = yup.object().shape({
      lastAddedURL: yup.string().trim().required().url().notOneOf(existingURLs),
    });
    return schema.validate(fields);
  };

  const watchedState = view(modelState, i18nToView, elements);

  //Controller
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get('url');
    watchedState.field.lastAddedURL = inputValue;

    validate(watchedState.field, watchedState.data.urls)
      .then(() => downloader(watchedState, inputValue))
      .catch((error) => {
        watchedState.error = error.message;
      });
    elements.form.reset();
    elements.input.focus();
  });
};
