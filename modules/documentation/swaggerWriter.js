var swaggerJSDoc = require('swagger-jsdoc');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

let schema = ['http','https']

// swagger definition
var swaggerDefinition = {
    info: {
        title: 'SHOP : API Documentation',
        version: '1.0',
        contact: 'admin@spericorn.com',
        description: 'There are the api documentation for the student management system',

    },
    host: `localhost:3000`,
    basePath: '/',
    schemes: [
        ...schema
    ],
    securityDefinitions: {
        Bearer: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header'
        }
    }

};

// options for the swagger docs
var options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: [
        './controllers/user/index.js',
        './controllers/product/index.js',
        './controllers/order/index.js'

    ]
};
// initialize swagger-jsdoc
const swaggerJson = swaggerJSDoc(options);
fs.writeFileAsync('./public/swagger.json', JSON.stringify(swaggerJson, null, 2))
    .then(function (rs) { })
    .catch(function (err) {
        console.log(err);
    });
module.exports = swaggerJson;
