const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._lastLineArr = [];
    this._linesArr=[];
    this._string = '';
  }

  _transform(chunk, encoding, callback) {
    if (this._lastLineArr.length !==0) {
      const lastLine = this._lastLineArr.join('');
      this._string = lastLine + chunk.toString();
    } else {
      this._string = chunk.toString();
    }

    const strArr = this._string.split(os.EOL);
    if (this._string[this._string.length - 1] !== os.EOL) {
      this._lastLineArr = strArr.slice(-1);
    }

    this._linesArr = strArr.slice(0, strArr.length - 1);
    this._linesArr.forEach((str) => this.push(str));
    callback();
  }

  _flush(callback) {
    (this._lastLineArr.length > 0) && this.push(this._lastLineArr.join(''));
    callback();
  }
}

module.exports = LineSplitStream;
