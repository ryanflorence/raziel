var crypto = require('crypto');

// Generates a random number between a min and a max
exports.rand = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// shallow copies the members of [n] supplied objects onto the first
exports.extend = function (){
  var target = arguments[0];

  for (var key, i = 1, l = arguments.length; i < l; i++)
    for (key in arguments[i])
      target[key] = arguments[i][key];

  return target;
};

// returns a random element of an array
exports.arr = {
  rand: function (arr) {
    return (arr.length) ? arr[exports.rand(0, arr.length - 1)] : null;
  }
};

// creates a sha1 digest
exports.sha1 = function (str) {
  return crypto.createHmac('sha1', '').update(str).digest('hex');
};

// key is the user's master password
exports.encrypt = function (str, key) {
  var cipher = crypto.createCipher('aes256', key);
  return cipher.update(str, 'utf8', 'hex') + cipher.final('hex');
};

exports.decrypt = function (encrypted, key) {
  var decipher = crypto.createDecipher('aes256', key);
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
};

