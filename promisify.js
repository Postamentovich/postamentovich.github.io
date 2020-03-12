function promisify(f) {
  return function(...args) {
    return new Promise(resolve => {
      function callback(result) {
        resolve(result);
      }
      args.push(callback);
      f.call(this, ...args);
    });
  };
}

module.exports = promisify;
