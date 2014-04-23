var emails = require('../email_provider');

var ValidationError = require('composed-validations/lib/index.coffee').ValidationError;

module.exports = {
  async: function () {
    return true;
  },

  test: function (value) {
    var _this = this;

    return emails.check(value).then(function (isUsed) {
      if (isUsed) {
        throw new ValidationError(value + " is already taken", value, _this)
      }
    });
  }
};
