
const MindsDB = require("mindsdb-js-sdk").default; // alternative for CommonJS syntax

try {

  // No authentication needed for self-hosting
  await MindsDB.connect({ // alternative for ES6 module syntax: await MindsDB.default.connect({
    host: 'http://127.0.0.1:47334'
  });
  console.log('connected');

} catch(error) {
  // Failed to connect to local instance
  console.log(error);
}