import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import axios from 'axios';
import parser from './parser.js';
import formatter from './formatter.js';
import view from './view.js';

// Model
const modelState = {
  field: {
    lastAddedURL: '',
  },
  language: 'ru',
  errors: '',
  isInvalid: false,
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
    return schema.validate(fields, { abortEarly: false });
  };

  const watchedState = view(modelState, i18nToView, elements);

  //Controller
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get('url');
    watchedState.field.lastAddedURL = inputValue;

    validate(watchedState.field, watchedState.data.urls)
      .then(() =>
        axios.get(
          `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
            inputValue
          )}`
        )
      )
      .then((response) => parser(response.data.contents))
      .then((doc) => formatter(doc))
      .then((formatedData) => {
        const isEqualFeed = (feed1, feed2) =>
          feed1.channelTitle === feed2.channelTitle;
        const isEqualPost = (post1, post2) => post1.link === post2.link;

        if (
          !watchedState.data.feeds.some((feed) =>
            isEqualFeed(feed, formatedData.feed)
          )
        ) {
          watchedState.data.feeds.push(formatedData.feed);
        }

        formatedData.posts.forEach((post) => {
          if (
            !watchedState.data.posts.some((existingPost) =>
              isEqualPost(existingPost, post)
            )
          ) {
            watchedState.data.posts.push(post);
          }
        });
      })
      .then(() => {
        watchedState.data.urls.push(inputValue);
      })
      .then(() => {
        watchedState.errors = 'no errors';
      })
      .catch((error) => {
        watchedState.errors = error.message;
      });
  });
};
