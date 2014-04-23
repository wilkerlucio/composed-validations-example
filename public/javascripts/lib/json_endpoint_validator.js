var $ = jQuery;

var v = require('composed-validations/lib/index.coffee');
var Promise = v.Promise;

// it sucks, but we have to wrap the jquery promise because it's not compliant with the Promises/A ... for more info: http://bugs.jquery.com/ticket/14510
function getJSON() {
  return Promise.from($.getJSON.apply($, arguments));
}

function factoryJsonEndpointValidator(endpoint) {
  return {
    async: function () {
      return true;
    },

    test: function (value) {
      var _this = this;

      return getJSON(endpoint, {value: value}).then(this.parseJsonResponse, function () {
        throw new v.ValidationError("error accessing the endpoint " + endpoint, value, _this);
      })
    },

    parseJsonResponse: function (data) {
      if (data) {
        throw new v.ValidationError(data.message, data.message, this);
      }
    }
  };
}

module.exports = factoryJsonEndpointValidator;
