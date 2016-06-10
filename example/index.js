require('./subfolder/index.js');

var copy = require('copy-asset');
copy('test.txt').then((data) => console.log('return: ', data));