import * as yup from 'yup';
import onChange from 'on-change';
import _, { create } from 'lodash';
import axios from 'axios';
import parser from './parser.js';
import formatter from './formatter.js';

// Model
const modelState = {
  field: {
    lastAddedURL: '',
  },
  language: 'ru',
  errors: {},
  data: {
    feeds: [],
    posts: [],
    urls: [],
  },
};

export { modelState };

export default (i18n) => {
  const elements = {
    input: document.querySelector('#url-input'),
    submitButton: document.querySelector('[type="submit"]'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    form: document.querySelector('form'),
    statusField: document.querySelector('.feedback'),
  };

  const schema = yup.object().shape({
    lastAddedURL: yup.string().trim().required().url(),
  });

  const validate = (fields) => {
    const promise = schema.validate(fields, { abortEarly: false });
    return promise;
  };

  // View
  const validateErrorsRender = (elements, value) => {
    if (!_.isEmpty(value)) {
      elements.statusField.classList.remove('text-success');
      elements.statusField.classList.add('text-danger');
      elements.statusField.textContent = i18n.t('linkValidationError');
      elements.input.classList.add('is-invalid');
    } else {
      elements.statusField.classList.remove('text-danger');
      elements.statusField.classList.add('text-success');
      elements.statusField.textContent = i18n.t('linkValidationSuccess');
      elements.input.classList.remove('is-invalid');
    }

    /* const linkAlreadyAddedErrorRender = (elements) => {
    const input = document.querySelector('#url-input');
    const statusField = document.querySelector('.feedback');

    statusField.classList.remove('text-success');
    statusField.classList.add('text-danger');
    statusField.textContent = i18n.t('linkAlreadyAdded');
    input.classList.add('is-invalid');
    console.log('-----------------------Я РАБОТАЮ! ДО МЕНЯ ДОХОДИТ!!!!!!!!!+++++++++++++++++++++'); */
  };

  const postsRender = (elements, value) => {
    const posts = elements.posts;
    posts.innerHTML = '';

    if (!posts.querySelector('.card.border-0')) {
      const card = document.createElement('div');
      card.classList.add('card', 'border-0');
      posts.appendChild(card);

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      card.appendChild(cardBody);

      const cardTitle = document.createElement('h2');
      cardTitle.classList.add('card-title', 'h4');
      cardTitle.textContent = i18n.t('posts');
      cardBody.appendChild(cardTitle);

      const listGroup = document.createElement('ul');
      listGroup.classList.add('list-group', 'border-0', 'rounded-0');
      card.appendChild(listGroup);
    }

    const listGroup = posts.querySelector('.list-group');

    value.forEach((post) => {
      const listGroupItem = document.createElement('li');
      listGroupItem.classList.add(
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
        'border-0',
        'border-end-0'
      );
      listGroup.appendChild(listGroupItem);

      const titledLink = document.createElement('a');
      titledLink.classList.add('fw-bold');
      titledLink.target = '_blank';
      titledLink.rel = 'noopenner noreferrer';
      titledLink.href = post.link;
      titledLink.dataset.id = post.id;
      titledLink.textContent = post.title;
      listGroupItem.appendChild(titledLink);

      titledLink.addEventListener('click', () => {
        titledLink.classList.remove('fw-bold');
        titledLink.classList.add('fw-normal', 'link-secondary');
      });

      const watchButton = document.createElement('button');
      watchButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      watchButton.type = 'button';
      watchButton.dataset.id = post.id;
      watchButton.dataset.bsToggle = 'modal';
      watchButton.dataset.bsTarget = '#modal';
      watchButton.textContent = i18n.t('watch');
      listGroupItem.appendChild(watchButton);

      watchButton.addEventListener('click', (e) => {
        const body = document.querySelector('body');
        body.removeAttribute('data-bs-overflow');
        body.removeAttribute('data-bs-padding-right');

        const modalWindow = document.querySelector('#modal');
        modalWindow.setAttribute('style', 'display: block;');

        const postID = e.target.dataset.id;
        const post = watchedState.data.posts.find((post) => post.id === postID);

        const sameHREF = document.querySelector(`a[data-id="${postID}"]`);
        sameHREF.classList.remove('fw-bold');
        sameHREF.classList.add('fw-normal', 'link-secondary');

        const modalWindowTitle = document.querySelector('.modal-title');
        modalWindowTitle.textContent = post.title;

        const modalWindowBody = document.querySelector('.modal-body');
        modalWindowBody.textContent = post.description;

        const modalWindowFooter = document.querySelector('.modal-footer');
        const readButton = modalWindowFooter.querySelector('a');
        const closeButton = modalWindowFooter.querySelector('button');

        readButton.href = post.link;
        readButton.textContent = i18n.t('read');

        closeButton.textContent = i18n.t('close');
      });
    });
  };

  const feedsRender = (elements, value) => {
    const feeds = elements.feeds;
    feeds.innerHTML = '';

    if (!feeds.querySelector('.card.border-0')) {
      const card = document.createElement('div');
      card.classList.add('card', 'border-0');
      feeds.appendChild(card);

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      card.appendChild(cardBody);

      const cardTitle = document.createElement('h2');
      cardTitle.classList.add('card-title', 'h4');
      cardTitle.textContent = i18n.t('feeds');
      cardBody.appendChild(cardTitle);

      const listGroup = document.createElement('ul');
      listGroup.classList.add('list-group', 'border-0', 'rounded-0');
      card.appendChild(listGroup);
    }

    const listGroup = feeds.querySelector('.list-group');

    value.forEach((feed) => {
      const listGroupItem = document.createElement('li');
      listGroupItem.classList.add(
        'list-group-item',
        'border-0',
        'border-end-0'
      );
      listGroup.insertBefore(listGroupItem, listGroup.firstChild);

      const feedTitle = document.createElement('h3');
      feedTitle.classList.add('h6', 'm-0');
      feedTitle.textContent = feed.channelTitle;
      listGroupItem.appendChild(feedTitle);

      const feedDescription = document.createElement('p');
      feedDescription.classList.add('m-0', 'small', 'text-black-50');
      feedDescription.textContent = feed.channelDescription;
      listGroupItem.appendChild(feedDescription);
    });
  };

  const watchedState = onChange(modelState, (path, value, previousValue) => {
    if (path === 'errors') {
      if (_.isEqual(value, previousValue))
        validateErrorsRender(elements, value);
    }

    if (path === 'data.posts' && !_.isEqual(value, previousValue)) {
      postsRender(elements, value);
    }

    if (path === 'data.feeds' && !_.isEqual(value, previousValue)) {
      feedsRender(elements, value);
    }
    /* console.log(path);
    console.log(value);
    console.log(previousValue); */
  });

  //Controller
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get('url');
    watchedState.field.lastAddedURL = inputValue;

    const errors = validate(watchedState.field)
      .then(() => {
        watchedState.errors = {};
        /* if (!watchedState.data.urls.includes(inputValue)) {
          watchedState.data.urls.push(inputValue);
        } else {
          watchedState.errors = "linkAlreadyAdded";
        }; */
      })
      .catch((error) => {
        watchedState.errors = error;
      });

    const rssDownload = axios
      .get(
        `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
          inputValue
        )}`
      )
      .then((response) => parser(response.data.contents))
      .then((doc) =>
        /* {
        if(watchedState.errors.length === 0) {
          return  }}*/
        formatter(doc)
      )
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
      });
  });
};
