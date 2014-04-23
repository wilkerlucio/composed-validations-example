var Promise = require('composed-validations/lib/index.coffee').Promise;

var provider = function () {
  var emails = ["wilkerlucio@gmail.com"];

  return {
    add: function (email) {
      emails.push(email);
    },

    check: function (email) {
      return Promise.resolve(emails.indexOf(email) > -1);
    }
  }
};

module.exports = provider();
