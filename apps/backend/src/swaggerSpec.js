// swaggerSpec.js
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MashchukCRM API',
      version: '1.0.0',
      description: 'API documentation for MyCRM',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/docs/*.yaml'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;