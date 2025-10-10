import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: 'Enrollment Manager API',
    description: "API for managing students, courses, and instructors",
  },
  host: 'enrolment-manager.onrender.com',
  schemes: ['https'],
};

const outputFile = './swagger.json'; // Output file for the generated Swagger documentation should be created in the root directory EMPTY
const routes = ['./routes/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);