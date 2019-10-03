const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const swaggerDefinition = {
  info: {
    title: 'Versity project',
    version: '0.0.1',
    description: `Versity-project is an project written for 'Software Development Methods' on Wrocław University of Science.`,
  },
  host: 'localhost:9000',
  basePath: '/api',
};
console.log(path.resolve(__dirname, '../routes/api.js'));
const options = {
  swaggerDefinition,
  apis: [path.resolve(__dirname, '../routes/api.js')],
};

module.exports = swaggerJSDoc(options);