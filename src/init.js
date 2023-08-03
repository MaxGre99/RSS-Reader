import * as yup from 'yup';
import onChange from 'on-change';
import _, { keyBy } from 'lodash';

export default () => {
  const elements = {
    input: document.querySelector('#url-input'),
    submitButton: document.querySelector('[type="submit"]'),
    list: document.querySelector('.container-fluid.container-xxl.p-5'),
    form: document.querySelector('form'),
    errorField: document.querySelector('.text-danger'),
  };

  const schema = yup.object().shape({
    url: yup.string().trim().required().url(),
  });

  const validate = (fields) => {
    const promise = schema
    .validate(fields, { abortEarly: false });
    return promise;
  };
  // Model
  const modelState = {
    field: {
      url: '',
    },
    errors: {},
    loadingState: false,
    submitted: false,
  };

  // View
  const render = (elements, path, value) => {
    if (path === 'errors') {
      if (!_.isEmpty(value)) {
      elements.errorField.textContent = 'Ссылка должна быть валидным URL';
      elements.input.classList.add('is-invalid');
      } else {
        elements.errorField.textContent = '';
        elements.input.classList.remove('is-invalid');
      };
    };
  };

  const changeState = onChange(modelState, (path, value, previousValue) => {
    if (path === 'errors' && !_.isEqual(value, previousValue)) {
      render(elements, path, value);
    };
  });

  //Controller
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get('url');
    changeState.field.url = inputValue;

    const errors = validate(changeState.field)
    .then(() => {
      changeState.errors = {};
    })
    .catch((error) => {
      changeState.errors = error;
      console.log(changeState.errors);
    });
  });
};