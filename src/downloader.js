import axios from 'axios';
import parser from './parser.js';
import formatter from './formatter.js';
import updater from './updater.js';

export default (watchedState, url) => {
  axios
    .get(
      `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
        url,
      )}`,
    )
    .then((response) => parser(response.data.contents))
    .then((doc) => formatter(doc))
    .then((formatedData) => {
      const isEqualFeed = (feed1, feed2) => feed1.channelTitle === feed2.channelTitle;
      const isEqualPost = (post1, post2) => post1.link === post2.link;

      if (!watchedState.data.feeds.some((feed) => isEqualFeed(feed, formatedData.feed))) {
        watchedState.data.feeds.push(formatedData.feed);
      }

      formatedData.posts.forEach((post) => {
        if (!watchedState.data.posts.some((existingPost) => isEqualPost(existingPost, post))) {
          watchedState.data.posts.push(post);
        }
      });
    })
    .then(() => {
      watchedState.data.urls.push(url);
    })
    .then(() => {
      watchedState.error = 'no error';
    })
    .catch((error) => {
      watchedState.error = error.message;
    })
    .finally(() =>
      watchedState.updatingIsOn === false
        ? updater(watchedState)
        : console.log('LOL! IT SHOULD BE TRUE NOW')
    );
};
