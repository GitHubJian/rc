const createRc = require('../dist').default;

const rc = createRc('tinyify', {});

const res = rc.load();

console.log(res);
