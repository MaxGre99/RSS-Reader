import rssGetter from './rssGetter.js';
import updater from './updater.js';

export default (watchedState, url) => {
  rssGetter(watchedState, url);

  const updaterCall = (watchedStateToUpdater) => (watchedState.updatingIsOn === false
    ? updater(watchedStateToUpdater)
    : null);

  updaterCall(watchedState);
};
