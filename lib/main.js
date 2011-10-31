// module dependencies
var generate = require('./generate'),
    program = require('commander'),
    fs = require('fs'),
    path = require('path'),
    util = require('./util'),
    spawn = require('child_process').spawn;

// global state
var callback, data, key, master
    authorized = false,
    dataPath = process.env.HOME + '/.raziel.json',
    commands = {};

// cli options
program.version('0.0.1')
  .option('-p, --pass [password]', 'specify a password')
  .option('-r, --reset', 'reset a password')
  .option('-l, --length [length]', 'length, no less than 6', parseInt)
  .option('-n, --nonumbers', 'no numbers', parseInt)
  .option('-u, --nouppercase', 'no uppercase')
  .option('-s, --nospecials', 'no special chars')
  .option('-e, --echo', 'echo password')
  .parse(process.argv);

commands.list = function () {
  var keys = Object.keys(data),
      index = keys.indexOf('master');
  keys.splice(index, 1);
  callback( keys.join('\n') );
};

function install () {
  console.log("# You need to set a master password.")
  console.log("# You'll be able to see it this time as you type, but never again.");
  console.log("# If you forget your master password then you're hosed, sorry.");
  program.prompt("==> Enter your master password: ", function (input) {
    var hash = util.sha1( input.trim() );
    data = { master: hash };
    run();
  });
}

function authorize () {
  program.password('password?', function (input) {
    master = input;
    authorized = data.master === util.sha1( input.trim() );
    if (authorized) return run();
    callback('# nice try ...');
  });
}

function getData () {
  path.exists(dataPath, function (exists) {
    if (!exists) return install();
    fs.readFile(dataPath, function (err, fileData) {
      data = JSON.parse( fileData.toString() );
      run();
    });
  });
}

function run () {
  if (program.args.length === 0)
    return callback( program.optionHelp() );

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
  var password = program.pass || generate(program);
  data[key] = util.encrypt(password, master);
  console.log('# password saved')
  report(password);
}

function report (password) {
  if (program.echo) {
    callback(password);
    return;
  }

  var echo = spawn('echo', ['-n', password]),
      pbcopy = spawn('pbcopy');

  echo.stdout.on('data', function (data) {
    pbcopy.stdin.write(data);
    pbcopy.stdin.end();
  });

  pbcopy.on('exit', function () {
    callback('# ' + key + ' copied to clipboard');
  });

}

process.on('exit', function() {
  fs.writeFileSync(dataPath, JSON.stringify(data), 'utf-8');
});

module.exports = function (cb) {
  callback = cb;
  getData();
};

