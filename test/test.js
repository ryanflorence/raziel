var raziel = require('../lib/main'),
    path = require('path'),
    tap = require('tap'),
    test = tap.test,
    plan = tap.plan,
    fs = require('fs');

test('creates a password file', function (t) {
  t.plan(1);

  var program = {
    args: ['twitter'],
    master: 'masterpassword',
    jsonfile: process.cwd() + '/tmptest.json'
  };

  raziel.exec(program, function (message) {
    fs.exists(program.jsonfile, function (exists) {
      t.ok(exists, 'created password file');
      fs.unlinkSync(program.jsonfile);
      t.end();
    })
  });

});

test('creates a password', function (t) {
  t.plan(1);

  var program = {
    args: ['foo'],
    pass: 'foopassword',
    echo: true,
    master: 'masterpassword',
    jsonfile: process.cwd() + '/tmptest.json'
  };

  raziel.exec(program, function (message) {
    t.equal(message, 'foopassword', 'created password');
    delete program.pass;
    raziel.exec(program, function (message2) {
      t.equal(message2, 'foopassword', 'returned password');
      fs.unlinkSync(program.jsonfile);
      t.end();
    });
  });
});

