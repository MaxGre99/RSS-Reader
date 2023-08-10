export default (data) => {
  const parser = new DOMParser();

  const doc = parser.parseFromString(data, 'application/xhtml+xml');
  return doc;
};