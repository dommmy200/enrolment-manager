const swaggerAutogen = require('swagger-autogen');

const doc = {
  swagger: '2.0',
  info: {
    title: 'Enrolment Manager API',
    version: '1.0.0',
    description: 'API for managing student enrolments'
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http', 'https'],
  paths: {
    // pre-define PUT path or leave empty—autogen will merge endpoints
    '/students/{id}': {
      put: {
        summary: 'Update an enrolled student',
        description: 'Updates fields for a student by ID.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            type: 'string',
            description: 'The MongoDB ObjectId of the student'
          },
          {
            name: 'body',
            in: 'body',
            required: true,
            description: 'Student object with updated fields',
            schema: { $ref: '#/definitions/StudentUpdate' }
          }
        ],
        responses: {
          200: { description: 'Student updated successfully', schema: { $ref: '#/definitions/Student' } },
          400: { description: 'Invalid input' },
          404: { description: 'Student not found' }
        }
      }
    }
  },
  definitions: {
    StudentUpdate: {
      type: 'object',
      properties: {
        firstName: { type: 'string', example: 'John' },
        lastName: { type: 'string', example: 'Doe' },
        email: { type: 'string', format: 'email', example: 'john@example.com' },
        phone: { type: 'string', example: '+2348012345678' },
        course: { type: 'string', enum: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'] },
        status: { type: 'string', enum: ['active', 'inactive', 'suspended', 'graduated'] },
        enrollmentDate: { type: 'string', format: 'date', example: '2025-09-01' },
        gpa: { type: 'number', format: 'float', example: 3.9 }
      },
      required: ['firstName', 'lastName', 'course', 'status']
    },
    Student: {
      allOf: [
        { $ref: '#/definitions/StudentUpdate' },
        { properties: { _id: { type: 'string', example: '64f1e2ab87a90bc1234abc56' } } }
      ]
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];
swaggerAutogen(outputFile, endpointsFiles, doc);

// const outputFile = './swagger.json';
// const endpointsFiles = ['./routes/index.js'];

// swaggerAutogen()(outputFile, endpointsFiles, doc);
