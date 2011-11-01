// module dependencies
var generate = require('./generate'),
    fs = require('fs'),
    path = require('path'),
    util = require('./util'),
    spawn = require('child_process').spawn;

// global state
var program, callback, data, key, master,
    authorized = false,
    dataPath = process.env.HOME + '/.raziel.json',
    commands = {};

commands.list = function () {
  var keys = Object.keys(data),
      index = keys.indexOf('master');
  keys.splice(index, 1);
  finish( keys.join('\n') );
};

commands.rm = function () {
  key = program.args[1];
  if (!key) return finish('# no password key to remove provided');
  var password = util.decrypt(data[key], master);
  delete data[key];
  finish('# ' + key + ' deleted, was: ' + password);
};

function install () {
  if (program.master) return setData(program.master);

  console.log("# You need to set a master password.")
  console.log("# You'll be able to see it this time as you type, but never again.");
  console.log("# If you forget your master password then you're hosed, sorry.");
  program.prompt("==> Enter your master password: ", function (input) {
    setData(input);
  });
}

function setData (_pass) {
  var pass = _pass.trim(),
      hash = util.encryptHash(pass);
  master = pass;
  data = { master: hash };
  run();
}

function authorize () {
  if (program.master) {
    master = program.master;
    return compareMaster();
  }

  program.password('password?', function (input) {
    master = input.trim();
    compareMaster();
  });
}

function compareMaster () {
  authorized = util.compareHash( master, data.master );
  if (authorized) return run();
  finish('# nice try ...');
}

function getData () {
  path.exists(dataPath, function (exists) {
    if (!exists) return install();
    fs.readFile(dataPath, function (err, fileData) {
      if (err) throw new Error(err);
      data = JSON.parse( fileData.toString() );
      run();
    });
  });
}

function run () {
  if (program.args.length === 0)
    return finish( program.optionHelp() );

  if (!authorized)
    return authorize();

  if (commands[program.args[0]])
    return commands[program.args[0]]();

  key = program.args[0];

  (program.reset || !data[key]) ? generatePassword() : getPassword();
}

function getPassword () {
  var encrypted = data[key],
      password = util.decrypt(encrypted, master);
  report(password);
}

function generatePassword () {
  var password = program.pass || generate(program),
      message = '';
  data[key] = util.encrypt(password, master);
  report(password);
}

function report (password) {
  if (program.echo) {
    finish(password);
    return;
  }

  var echo = spawn('echo', ['-n', password]),
      pbcopy = spawn('pbcopy');

  echo.stdout.on('data', function (data) {
    pbcopy.stdin.write(data);
    pbcopy.stdin.end();
  });

  pbcopy.on('exit', function () {
    finish('# ' + key + ' copied to clipboard');
  });

}

function finish (message) {
  callback(message);
}

exports.exec = function (_program, _callback) {
  program = _program;
  callback = function () {
    fs.writeFileSync(dataPath, JSON.stringify(data), 'utf-8');
    _callback.apply(null, arguments);
  };
  if (program.jsonfile) dataPath = program.jsonfile;
  getData();
};

