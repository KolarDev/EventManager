const swaggerAutogen = require('swagger-autogen')();
const eventDocs = require('./../docs/eventDocs');
const cartDocs = require('./../docs/cartDocs');
const userDocs = require('./../docs/userDocs');
const favouriteDocs = require('./../docs/favouriteDocs');
const ticketDocs = require('./../docs/ticketDocs');

const doc = {
  info: {
    title: 'Event Management API',
    description: 'Auto-generated Swagger documentation using swagger-autogen',
    version: '1.0.0',
  },
  host: 'localhost:4041',
  basePath: '/api/v1',
  schemes: ['http'],
  tags: [
    {
      name: 'Carts',
      description: 'Operations related to the shopping cart',
    },
    {
      name: 'Users',
      description: 'User authentication and profile operations',
    },
    {
      name: 'Events',
      description: 'Event-related endpoints',
    },
    // Add more tags as needed...
  ],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
  paths: {
    ...eventDocs,
    ...cartDocs,
    ...userDocs,
    ...favouriteDocs,
    ...ticketDocs,
  },
};

const outputFile = './swagger-output.json'; // The generated file
const routes = ['./../app.js']; // Entry point to your routes

swaggerAutogen(outputFile, routes, doc);
