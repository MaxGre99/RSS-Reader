export default (data) => {
  const parser = new DOMParser();

  const doc = parser.parseFromString(data, 'application/xhtml+xml');
  const possibleError = doc.querySelector('parsererror');
  if (possibleError) {
    throw Error('not RSS');
  }
  return doc;
};
