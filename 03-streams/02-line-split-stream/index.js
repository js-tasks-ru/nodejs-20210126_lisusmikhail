const LineSplitStream = require('./LineSplitStream');
const os = require('os');

const lines = new LineSplitStream({
  encoding: 'utf-8',
});

function onData(lines) {
  console.log('lines=', lines);
}

lines.on('data', onData);

// eslint-disable-next-line max-len
lines.write(`первая строка${os.EOL}вторая строка${os.EOL}третья строка${os.EOL}еще одна третья строка${os.EOL}четвертая стро-`);
// eslint-disable-next-line max-len
lines.write(`-ка продолжение строки${os.EOL}шестая строка${os.EOL}седьмая строка${os.EOL}восьмая строка${os.EOL}девята-`);
// eslint-disable-next-line max-len
lines.write(`-я строка${os.EOL}10 строка${os.EOL}11 строка${os.EOL}12-ая строка${os.EOL}13 остаток`);

lines.end();
