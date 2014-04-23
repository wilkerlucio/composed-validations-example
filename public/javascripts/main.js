var $ = jQuery;

require("./lib/form_validator");

var factoryJsonEndpointValidator = require('./lib/json_endpoint_validator');
var userValidator = require('../../lib/validations/user_validator')(factoryJsonEndpointValidator('/users/verify_email'));

function errorToHtml(err) {
  return '<p class="text-danger">' + err.message + '</p>';
}

function findFieldComponents(fieldName) {
  var $input, $container, $errorContainer;

  $input = $("input[name='" + fieldName + "']");

  if ($input.length == 0) throw new Error("can't find input with name " + fieldName);

  $container = $input.closest('.form-group');
  $errorContainer = $container.find(".help-block");

  return {
    $input: $input,
    $container: $container,
    $errorContainer: $errorContainer
  };
}

$('form').validate(userValidator, {
  send: function (data) {
    console.log('form sent! here is the response', data);
  },

  fieldSuccess: function (fieldName) {
    var field = findFieldComponents(fieldName);

    field.$container.removeClass('has-error');
    field.$container.addClass('has-success');
    field.$errorContainer.html("");
  },

  fieldError: function (fieldName, errors) {
    var field = findFieldComponents(fieldName);

    field.$container.removeClass('has-success');
    field.$container.addClass('has-error');
    field.$errorContainer.html(errors.map(errorToHtml).join(''));
  }
});
