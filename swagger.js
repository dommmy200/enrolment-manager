const { version } = require('mongoose');
const swaggerAutogen = require('swagger-autogen');

const doc = {
  info: {
    title: "Enrolment Manager API",
    description: "API for managing students, instructors, and courses",
    version: "1.0.0"
  },
  host: "localhost:3000",
  schemes: ["http"],
  securityDefinitions: {
      // Name the scheme 'cookieAuth'
      cookieAuth: {
          type: 'apiKey', // Treat the cookie as an API Key
          in: 'cookie',   // Tell Swagger to look in the Cookie header
          name: 'connect.sid', // The standard name of the Express session cookie
          description: 'Provide the session cookie for authentication after logging in via GitHub.'
      }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    },
    schemas: {
      Course: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '68cf25a08222d64a3dfa3001' },
          title: { type: 'string', example: 'Introduction to Computer Science' },
          code: { type: 'string', example: 'CS101' },
          credits: { type: 'integer', example: 3 },
          department_id: { type: 'string', example: '68cf25a08222d64a3dfa1001' },
          instructor_id: { type: 'string', example: '68cf25a08222d64a3dfa2001' }
        },
        required: ['title', 'code', 'credits', 'department_id', 'instructor_id']
      },
      Student: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '68cf25a08222d64a3dfa4001' },
          first_name: { type: 'string', example: 'John' },
          last_name: { type: 'string', example: 'Doe' },
          email: { type: 'string', example: 'johndoe@example.com' },
          phone_number: { type: 'string', example: '+1234567890' },
          enrolment_date: { type: 'string', format: 'date', example: '2025-01-10' },
          status: { type: 'string', example: 'active' },
          gpa: { type: 'number', example: 3.8 },
          course_id: { type: 'string', example: '68cf25a08222d64a3dfa3001' }
        },
        required: ['first_name', 'last_name', 'email', 'enrolment_date', 'status', 'course_id']
      },
      Instructor: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '68cf25a08222d64a3dfa2001' },
          first_name: { type: 'string', example: 'Jane' },
          last_name: { type: 'string', example: 'Smith' },
          email: { type: 'string', example: 'janesmith@example.com' },
          phone_number: { type: 'string', example: '+1987654321' },
          department_id: { type: 'string', example: '68cf25a08222d64a3dfa1001' },
          hire_date: { type: 'string', format: 'date', example: '2020-08-15' }
        },
        required: ['first_name', 'last_name', 'email', 'department_id', 'hire_date']
      }
    },
    security: [ // Global security requirement
      { 
        bearerAuth: []
      }
    ]
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js']; // make sure this file imports students, instructors, courses
swaggerAutogen(outputFile, endpointsFiles, doc);
