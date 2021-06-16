const server = require('./service');
server().listen(5000, () => console.log("listening localhost:5000"));