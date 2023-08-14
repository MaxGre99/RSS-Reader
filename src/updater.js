/* import axios from 'axios';
import parser from './parser.js';
import formatter from './formatter.js';

const updater = (watchedState) => {
  watchedState.updatingIsOn = true;

  const { urls } = watchedState.data;

  const fetchPromises = urls.map((url) => {
    return axios
      .get(
        `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
          url
        )}`
      )
      .then((response) => parser(response.data.contents))
      .then((doc) => formatter(doc))
      .catch((error) => {
        watchedState.error = error.message;
        return {};
      });
  });

  Promise.all(fetchPromises)
    .then((results) => {
      const isEqualPost = (post1, post2) => post1.link === post2.link;

      results.forEach((formatedData) => {
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
    })
    .finally(() => {
      setTimeout(() => updater(watchedState), 5000);
    });
};

export default updater; */
import axios from 'axios';
import parser from './parser.js';
import formatter from './formatter.js';

const updater = (watchedState) => {
  watchedState.updatingIsOn = true;

  const { urls } = watchedState.data;

  urls.forEach((url) => {
    axios
      .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
      .then((response) => parser(response.data.contents))
      .then((doc) => formatter(doc))
      .then((formatedData) => {
        const isEqualPost = (post1, post2) => post1.link === post2.link;

        formatedData.posts.forEach((post) => {
          if (!watchedState.data.posts.some((existingPost) => isEqualPost(existingPost, post))) {
            watchedState.data.posts.push(post);
          }
        });
      })
      .catch((error) => {
        watchedState.error = error.message;
      });
  });
  setTimeout(() => updater(watchedState), 5000);
};

export default updater;
