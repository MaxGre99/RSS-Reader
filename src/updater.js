/* import rssGetter from './rssGetter.js';

const updater = (watchedState) => {
  watchedState.updatingIsOn = true;
  const { urls } = watchedState.data;

  urls.forEach((url) => {
    rssGetter(watchedState, url);
  });
  setTimeout(() => updater(watchedState), 5000);
};
export default updater; */
import axios from 'axios';
import parser from './parser.js';
import formatter from './formatter.js';

const updater = (watchedState) => {
  console.log(new Date());
  const { urls } = watchedState.data;

  const fetchedPromises = urls.map((url) => axios
    .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
    .then((response) => parser(response.data.contents))
    .then((doc) => formatter(doc))
    .catch((error) => {
      watchedState.error = error;
    }));

  Promise.all(fetchedPromises)
    .then((formatedDatasArray) => {
      formatedDatasArray.forEach((formatedData) => {
        const isEqualPost = (post1, post2) => post1.link === post2.link;
        const isEqualFeed = (feed1, feed2) => feed1.channelTitle === feed2.channelTitle;

        if (!watchedState.data.feeds.some((feed) => isEqualFeed(feed, formatedData.feed))) {
          watchedState.data.feeds.push(formatedData.feed);
        }

        formatedData.posts.forEach((post) => {
          if (!watchedState.data.posts.some((existingPost) => isEqualPost(existingPost, post))) {
            watchedState.data.posts.push(post);
          }
        });
      });
    })
    .catch((error) => {
      watchedState.error = error;
    })
    .finally(() => {
      setTimeout(() => updater(watchedState), 5000);
    });
};

export default updater;
