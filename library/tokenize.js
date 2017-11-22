'use strict';

const natural = require('natural');
const tokenizer = new natural.WordPunctTokenizer();

module.exports = (string) => {
  return tokenizer.tokenize(string.replace(/(\r\n|\n|\r)/gm, ''));
};