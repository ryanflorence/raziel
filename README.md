raziel
------

Command-line password management.

Installation
------------

raziel is built on [node.js](http://nodejs.org), install with
[npm](http://npmjs.org).

    $ npm install -g raziel

Basic Usage
-----------

### First Run

You may need to restart your terminal session after installing with npm.

The first time you save a password raziel asks for the master password. The
sha1 hash of this password is stored in `~/.raziel.json`. It's also used as
the encryption key to all of your passwords, so if you forget it, you're
hosed.  Sorry.

If you don't like raziel, uninstall the module and delete ~/.raziel.json.

### Create a password and store it by key

    $ raziel twitter

It will ask you for your master password and then save a new password
for twitter and copy it to your clipboard (Mac OS X).

### Retrieve a stored password by key

    $ raziel twitter

Copies your twitter password to the clipboard.

### List keys

    $ raziel list

Obviously, you can't store a password with the name `list` :P

Options
-------

    -h, --help             output usage information
    -v, --version          output the version number
    -p, --pass [password]  specify a password
    -r, --reset            reset a password
    -l, --length [length]  length, no less than 6
    -n, --nonumbers        no numbers
    -u, --nouppercase      no uppercase
    -s, --nospecials       no special chars
    -e, --echo             echo password

### Examples

Create a new, auto-generated password

    $ raziel fb

Reset the password to a new autho-generated password

    $ raziel fb -r

Echo the password instead of copying to clipboard

    $ raziel fb -e

Create a new specific password

    $ raziel github -p muhpassword

Reset and specify a password

    $ raziel fb -rp muhtherpassword

Generate a 32 character password

    $ raziel bank -l 32

Generate a password with no special chars

    $ raziel whatevs -s

Generate a really crappy password (no caps, no numbers, no specials, 6
chars)

    $ raziel pansie -nusl 6

WHAT IF SOMEBODY JACKS MY PASSWORD FILE!?
-----------------------------------------

Your master password is stored as a sha1 hash.

Your other passwords are encrypted with aes256 using your raw master
password as the key (which isn't stored anywhere, you provide it with
each use).

License
-------

MIT Style license

