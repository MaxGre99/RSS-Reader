import _ from 'lodash';

export default (doc) => {
  const items = doc.querySelectorAll('item');
  const channel = doc.querySelector('channel');
  const channelTitle = channel.querySelector('title');
  const channelDescription = channel.querySelector('description');

  const feed = {
    id: _.uniqueId(),
    channelTitle: channelTitle.textContent,
    channelDescription: channelDescription.textContent,
  };
  const posts = [];

  const rssData = {
    feed,
    posts: posts,
  };

  items.forEach((item) => {
    const title = item.querySelector('title');
    const description = item.querySelector('description');
    const link = item.querySelector('link');

    const post = {
      id: _.uniqueId(),
      title: title.textContent,
      description: description.textContent,
      link: link.textContent,
    };
    posts.push(post);

  });
  return rssData;
};

/* const rssData1 = {
  feed,
  posts: [ {post1}, {post2}, {post3}, {post4}, ],
};

const data = {
  feeds: [],
  posts: [],
}; */