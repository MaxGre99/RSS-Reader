import onChange from 'on-change';
import _ from 'lodash';

export default (modelState, i18n, elements) => {
  const validateErrorRender = (elements, value) => {
    if (value.includes('must not be one of the following values')) {
      elements.statusField.classList.remove('text-success');
      elements.statusField.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
      elements.statusField.textContent = i18n.t('errors.linkAlreadyAdded');
    } else if (value.includes('must be a valid URL')) {
      elements.statusField.classList.remove('text-success');
      elements.statusField.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
      elements.statusField.textContent = i18n.t('errors.linkValidationError');
    } else if (value.includes('not RSS')) {
      elements.statusField.classList.remove('text-success');
      elements.statusField.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
      elements.statusField.textContent = i18n.t('errors.notRSS');
    } else if (value.includes('Network Error')) {
      elements.statusField.classList.remove('text-success');
      elements.statusField.classList.add('text-danger');
      elements.input.classList.add('is-invalid');
      elements.statusField.textContent = i18n.t('errors.networkError');
    } else if (value.includes('no error')) {
      elements.statusField.classList.remove('text-danger');
      elements.statusField.classList.add('text-success');
      elements.input.classList.remove('is-invalid');
      elements.statusField.textContent = i18n.t('errors.linkValidationSuccess');
    }
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
      cardTitle.textContent = i18n.t('descriptions.posts');
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
      watchButton.textContent = i18n.t('descriptions.watch');
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
        readButton.textContent = i18n.t('descriptions.read');

        closeButton.textContent = i18n.t('descriptions.close');
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
      cardTitle.textContent = i18n.t('descriptions.feeds');
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
    if (path === 'error') {
      validateErrorRender(elements, value);
    }

    if (path === 'data.posts' && !_.isEqual(value, previousValue)) {
      postsRender(elements, value);
    }

    if (path === 'data.feeds' && !_.isEqual(value, previousValue)) {
      feedsRender(elements, value);
    }
    console.log(path);
    console.log(previousValue);
    console.log(value);
  });
  return watchedState;
};
