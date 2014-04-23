function FormValidator($form, validator, options) {
  var _this = this;

  this.$form = $form;
  this.validator = validator;
  this.options = $.extend({
    disableFormDelay: 100
  }, options || {});

  $form.submit(function (e) {
    e.preventDefault();

    _this.send();
  });

  $form.find(':input').each(function () { _this.setupField($(this)); });
}

FormValidator.prototype = {
  send: function () {
    var _this = this;
    var data = this.serializeForm();

    this.disableForm();

    this.validator.test(data).then(function () {
      $.post(_this.$form.attr('action'), data).then(function (err) {
        if (err)
          _this.updateErrors(err);
      });
    }).catch(function (err) {
      _this.enableForm();
      _this.updateErrors(err);
    }).done();
  },

  updateErrors: function (err) {
    var fieldName;

    for (fieldName in err.fieldErrors) {
      this.updateErrorsOnField(fieldName, err.fieldErrors[fieldName]);
    }
  },

  updateErrorsOnField: function (fieldName, errors) {
    if (errors.length == 0) {
      this.options.fieldSuccess(fieldName);
    } else {
      this.options.fieldError(fieldName, errors);
    }
  },

  setupField: function ($input) {
    var delay, fieldName, _this;

    _this = this;
    fieldName = $input.attr('name');

    $input.on('input change', function () {
      clearTimeout(delay);

      delay = setTimeout(function () {
        var data = _this.serializeForm();

        _this.validator.testField(fieldName, data).done(function () {
          _this.updateErrorsOnField(fieldName, []);
        }, function (err) {
          _this.updateErrorsOnField(fieldName, err.errors);
        });
      }, 200);
    });
  },

  serializeForm: function () {
    var object = {};
    var serial = this.$form.serializeArray();

    serial.forEach(function (pair) {
      object[pair.name] = pair.value;
    });

    return object;
  },

  disableForm: function () {
    var _this = this;

    this.disableFormTimer = setTimeout(function () {
      _this.$form.find(':input').attr('disabled', true);
    }, this.options.disableFormDelay);
  },

  enableForm: function () {
    clearTimeout(this.disableFormTimer);
    this.$form.find(':input').attr('disabled', false);
  }
};

$.fn.validate = function (validator, fieldFactory, options) {
  $(this).each(function () {
    new FormValidator($(this), validator, fieldFactory, options);
  });
};

module.exports = FormValidator;
