// updater.js
import rssGetter from './rssGetter.js';

const updater = (watchedState) => {
  watchedState.updatingIsOn = true;
  const { urls } = watchedState.data;

  urls.forEach((url) => {
    rssGetter(watchedState, url);
  });
  setTimeout(() => updater(watchedState), 5000);
};
export default updater;
