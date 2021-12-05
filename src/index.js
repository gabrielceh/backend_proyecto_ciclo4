const app = require('./app');

const init = async () => {
  const port = 8080;
  await app.listen(port);
  console.log('Server on port', port);
};

init();
