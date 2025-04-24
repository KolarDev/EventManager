const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Event Management API',
    description: 'Auto-generated Swagger documentation using swagger-autogen',
    version: '1.0.0',
  },
  host: 'localhost:4041',
  basePath: '/',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const outputFile = './swagger-output.json'; // The generated file
const routes = ['./app.js']; // Entry point to your routes

swaggerAutogen(outputFile, routes, doc);
