// const { version } = require('mongoose');
const swaggerAutogen = require('swagger-autogen')({ });
const outputFile = './swagger.json';

// const swaggerDocument = {
//   // CRITICAL: Must only declare 'openapi'
//   openapi: '3.0.0',
  
//   info: {
//     title: 'Enrolment Manager API',
//     description: 'API for managing students, instructors, and courses',
//     version: '1.0.0'
//   },
  
//   servers: [
//     { url: 'http://localhost:3000', description: 'Local server' }
//   ],

//   tags: [
//     {
//       name: 'Students',
//       description: 'Operations related to student enrollment, retrieval, and management.'
//     },
//     {
//       name: 'Courses',
//       description: 'Operations for managing and querying courses and their details.'
//     },
//     {
//       name: 'Instructors',
//       description: 'Operations for managing instructors and retrieving faculty information.'
//     },
//     {
//       name: 'Auth',
//       description: 'User authentication and session management (Login, GitHub OAuth).'
//     }
//   ],

//   // Global security (applies to all paths by default)
//   security: [
//     { 
//       bearerAuth: []
//     }
//   ],

//   components: {
//     securitySchemes: {
//       bearerAuth: {
//         type: 'http',
//         scheme: 'bearer',
//         bearerFormat: 'JWT',
//       },
//       cookieAuth: {
//         type: 'apiKey',
//         in: 'cookie',
//         name: 'connect.sid',
//         description: 'Used internally by Passport/Express for session management.'
//       }
//     },
    
//     // SCHEMAS (OAS 3.0 term)
//     // CRITICAL FIX: We are defining the model properties directly.
//     // This often forces swagger-autogen to structure the final JSON correctly
//     // instead of creating deeply nested corruption.
//     schemas: {
//       Course: {
//         _id: { type: 'string', example: '68cf25a08222d64a3dfa3001' },
//         title: { type: 'string', example: 'Introduction to Computer Science' },
//         code: { type: 'string', example: 'CS101' },
//         credits: { type: 'integer', example: 3 },
//         department_id: { type: 'string', example: '68cf25a08222d64a3dfa1001' },
//         instructor_id: { type: 'string', example: '68cf25a08222d64a3dfa2001' },
//         // The 'required' array is explicitly passed here for correct generation
//         required: ['title', 'code', 'credits', 'department_id', 'instructor_id']
//       },
//       Student: {
//         _id: { type: 'string', example: '68cf25a08222d64a3dfa4001' },
//         first_name: { type: 'string', example: 'John' },
//         last_name: { type: 'string', example: 'Doe' },
//         email: { type: 'string', example: 'johndoe@example.com' },
//         phone_number: { type: 'string', example: '+1234567890' },
//         enrolment_date: { type: 'string', format: 'date', example: '2025-01-10' },
//         status: { type: 'string', example: 'active' },
//         gpa: { type: 'number', example: 3.8 },
//         course_id: { type: 'string', example: '68cf25a08222d64a3dfa3001' },
//         required: ['first_name', 'last_name', 'email', 'enrolment_date', 'status', 'course_id']
//       },
//       Instructor: {
//         _id: { type: 'string', example: '68cf25a08222d64a3dfa2001' },
//         first_name: { type: 'string', example: 'Jane' },
//         last_name: { type: 'string', example: 'Smith' },
//         email: { type: 'string', example: 'janesmith@example.com' },
//         phone_number: { type: 'string', example: '+1987654321' },
//         department_id: { type: 'string', example: '68cf25a08222d64a3dfa1001' },
//         hire_date: { type: 'string', format: 'date', example: '2020-08-15' },
//         required: ['first_name', 'last_name', 'email', 'department_id', 'hire_date']
//       }
//     }
//   }
// };

const swaggerDocument = {
  // CRITICAL: Must only declare 'openapi'
  openapi: '3.0.0',
  
  info: {
    title: 'Enrolment Manager API',
    description: 'API for managing students, instructors, and courses',
    version: '1.0.0'
  },
  
  servers: [
    { url: 'http://localhost:3000', description: 'Local server' }
  ],

  tags: [
    {
      name: 'Students',
      description: 'Operations related to student enrollment, retrieval, and management.'
    },
    {
      name: 'Courses',
      description: 'Operations for managing and querying courses and their details.'
    },
    {
      name: 'Instructors',
      description: 'Operations for managing instructors and retrieving faculty information.'
    },
    {
      name: 'Auth',
      description: 'User authentication and session management (Login, GitHub OAuth).'
    }
  ],

  // Global security (applies to all paths by default)
  security: [
    { 
      bearerAuth: []
    }
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'connect.sid',
        description: 'Used internally by Passport/Express for session management.'
      }
    },
    
    // SCHEMAS (OAS 3.0 term)
    schemas: {
      Course: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '68cf25a08222d64a3dfa3001' },
          title: { type: 'string', example: 'Introduction to Computer Science' },
          code: { type: 'string', example: 'CS101' },
          credits: { type: 'integer', example: 3 },
          department_id: { type: 'string', example: '68cf25a08222d64a3dfa1001' },
          instructor_id: { type: 'string', example: '68cf25a08222d64a3dfa2001' },
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
          course_id: { type: 'string', example: '68cf25a08222d64a3dfa3001' },
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
          hire_date: { type: 'string', format: 'date', example: '2020-08-15' },
        },
        required: ['first_name', 'last_name', 'email', 'department_id', 'hire_date']
      }
    }
  }
};

module.exports = swaggerDocument;

// const endpointsFiles = ['./routes/index.js']; // make sure this file imports students, instructors, courses
const endpointsFiles = [
    './routes/index.js',
    './routes/students.js',
    './routes/courses.js',
    './routes/instructors.js'
];
// swaggerAutogen(outputFile, endpointsFiles, doc);
// Run the generator
swaggerAutogen(outputFile, endpointsFiles, swaggerDocument).then(() => {
    console.log('Swagger documentation generated successfully to swagger.json');
    // You can optionally require the server file here to start the app
    // require('./server.js'); 
});
