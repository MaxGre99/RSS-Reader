import axios from 'axios';
import parser from './parser.js';

export default (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => parser(response.data.contents));
