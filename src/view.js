import onChange from 'on-change';
import _ from 'lodash';

const errorRender = (elements) => {
  elements.statusField.classList.remove('text-success');
  elements.statusField.classList.add('text-danger');
  elements.input.classList.add('is-invalid');
};

const validateErrorRender = (elements, value, i18n) => {
  switch (true) {
    case value.includes('must not be one of the following values'):
      errorRender(elements);
      elements.statusField.textContent = i18n.t('errors.linkAlreadyAdded');
      break;
    case value.includes('must be a valid URL'):
      errorRender(elements);
      elements.statusField.textContent = i18n.t('errors.linkValidationError');
      break;
    case value.includes('not RSS'):
      errorRender(elements);
      elements.statusField.textContent = i18n.t('errors.notRSS');
      break;
    case value.includes('Network Error'):
      errorRender(elements);
      elements.statusField.textContent = i18n.t('errors.networkError');
      break;
    case value.includes('no error'):
      elements.statusField.classList.remove('text-danger');
      elements.statusField.classList.add('text-success');
      elements.input.classList.remove('is-invalid');
      elements.statusField.textContent = i18n.t('errors.linkValidationSuccess');
      break;
    case value.includes('is a required'):
      break;
    default:
      throw new Error(`Unknown error value: '${value}'!`);
  }
};

const cardCreate = () => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  return card;
};

const postsRender = (elements, value, i18n, watchedState) => {
  const { posts } = elements;
  posts.innerHTML = '';

  if (!posts.querySelector('.card.border-0')) {
    const card = cardCreate();
    posts.appendChild(card);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    card.appendChild(cardBody);

    const cardTitle = document.createElement('h2');
    cardTitle.classList.add('card-title', 'h4');
    cardTitle.textContent = i18n.t('descriptions.posts');
    cardBody.appendChild(cardTitle);

    const listGroup = document.createElement('ul');
    listGroup.classList.add('list-group', 'border-0', 'rounded-0');
    card.appendChild(listGroup);
  }

  const listGroup = posts.querySelector('.list-group');

  value.forEach((ofPosts) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    listGroup.appendChild(listGroupItem);

    const titledLink = document.createElement('a');
    titledLink.classList.add('fw-bold');
    titledLink.target = '_blank';
    titledLink.rel = 'noopenner noreferrer';
    titledLink.href = ofPosts.link;
    titledLink.dataset.id = ofPosts.id;
    titledLink.textContent = ofPosts.title;
    listGroupItem.appendChild(titledLink);

    titledLink.addEventListener('click', () => {
      titledLink.classList.remove('fw-bold');
      titledLink.classList.add('fw-normal', 'link-secondary');
    });

    const watchButton = document.createElement('button');
    watchButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    watchButton.type = 'button';
    watchButton.dataset.id = ofPosts.id;
    watchButton.dataset.bsToggle = 'modal';
    watchButton.dataset.bsTarget = '#modal';
    watchButton.textContent = i18n.t('descriptions.watch');
    listGroupItem.appendChild(watchButton);

    watchButton.addEventListener('click', (e) => {
      // const body = document.querySelector('body');
      // body.removeAttribute('data-bs-overflow');
      // body.removeAttribute('data-bs-padding-right');

      // const modalWindow = document.querySelector('#modal');
      // modalWindow.setAttribute('style', 'display: block;');

      const postID = e.target.dataset.id;
      const postData = watchedState.data.posts.find((post) => post.id === postID);

      const sameHREF = document.querySelector(`a[data-id="${postID}"]`);
      sameHREF.classList.remove('fw-bold');
      sameHREF.classList.add('fw-normal', 'link-secondary');

      const modalWindowTitle = document.querySelector('.modal-title');
      modalWindowTitle.textContent = postData.title;

      const modalWindowBody = document.querySelector('.modal-body');
      modalWindowBody.textContent = postData.description;

      const modalWindowFooter = document.querySelector('.modal-footer');
      const readButton = modalWindowFooter.querySelector('a');
      // const closeButton = modalWindowFooter.querySelector('button');

      readButton.href = postData.link;
      readButton.textContent = i18n.t('descriptions.read');

      // closeButton.textContent = i18n.t('descriptions.close');
    });
  });
};

const feedsRender = (elements, value, i18n) => {
  const { feeds } = elements;
  feeds.innerHTML = '';

  if (!feeds.querySelector('.card.border-0')) {
    const card = cardCreate();
    feeds.appendChild(card);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    card.appendChild(cardBody);

    const cardTitle = document.createElement('h2');
    cardTitle.classList.add('card-title', 'h4');
    cardTitle.textContent = i18n.t('descriptions.feeds');
    cardBody.appendChild(cardTitle);

    const listGroup = document.createElement('ul');
    listGroup.classList.add('list-group', 'border-0', 'rounded-0');
    card.appendChild(listGroup);
  }

  const listGroup = feeds.querySelector('.list-group');

  value.forEach((feed) => {
    const listGroupItem = document.createElement('li');
    listGroupItem.classList.add('list-group-item', 'border-0', 'border-end-0');
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

export default (modelState, i18nToRender, elementsToRender) => {
  const watchedState = onChange(modelState, (path, value, previousValue) => {
    if (path === 'error') {
      validateErrorRender(elementsToRender, value, i18nToRender);
    }

    if (path === 'data.posts' && !_.isEqual(value, previousValue)) {
      postsRender(elementsToRender, value, i18nToRender, watchedState);
    }

    if (path === 'data.feeds' && !_.isEqual(value, previousValue)) {
      feedsRender(elementsToRender, value, i18nToRender);
    }
    // console.log(path);
    // console.log(previousValue);
    // console.log(value);
  });
  return watchedState;
};
