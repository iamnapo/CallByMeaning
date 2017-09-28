'use strict';

module.exports = function (date) {
  let temp = new Date(date);
  return (temp.getTime() / 1000);
};