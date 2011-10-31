var util = require('./util'),
    defaults = {
      length: 24,
      nonumbers: false,
      nolowercase: false,
      nospecials: false
    };

module.exports = function (options) {
  var settings = util.extend({}, defaults, options),
      password = '',
      bank = [],
      length = Math.max(settings.length, 6);

  bank.push('abcdefghijklmnopqrstuvwxyz'.split(''));
  if (!settings.nouppercase) bank.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''));
  if (!settings.nonumbers) bank.push('123456789'.split(''));
  if (!settings.nospecials) bank.push('!#$%&()*+,-./:<=>?@[\\]^_`{|}~'.split(''));

  for (var i = 0; i < length; i++) {
    password += util.arr.rand( util.arr.rand(bank) );
  }

  return password;
};

