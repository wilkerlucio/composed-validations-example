var v = require('composed-validations/lib/index.coffee'),
    StructValidator = v.StructValidator,
    PresenceValidator = v.PresenceValidator,
    FormatValidator = v.FormatValidator;

var passwordConfirmValidator = {
  test: function (value) {
    if (value.password != value.password_confirmation) {
      throw new v.ValidationError("Password confirmation doesn't match with the password", null, this)
    }
  }
};

var emailValidator = new FormatValidator(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i);

module.exports = function (uniqEmailValidator) {
  return new StructValidator({async: true})
      .validate('name', 'email', 'password', 'password_confirmation', new PresenceValidator())
      .validate('email', emailValidator)
      .validate('email', uniqEmailValidator)
      .addAssociated('password_confirmation', passwordConfirmValidator);
};
