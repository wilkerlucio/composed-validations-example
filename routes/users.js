var express = require('express');
var router = express.Router();

var emailValidator = require('../lib/validations/uniq_email_validator');
var userValidator = require('../lib/validations/user_validator')(emailValidator);

var factoryValidationService = function (validator) {
  return function (req, res) {
    var value = req.query.value;

    setTimeout(function () {
      validator.test(value).then(function () {
        res.json(null);
      }, function (err) {
        res.json(err);
      });
    }, 1);
  }
};

router.get('/verify_email', factoryValidationService(emailValidator));

router.post('/', function(req, res) {
  userValidator.test(req.body).then(function () {
    res.json('all valid');
  }).catch(function (err) {
    res.json(400, err);
  });
});

module.exports = router;
