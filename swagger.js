const fs = require("fs");
const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: "School API",
    description: "School student, instructors, and courses API"
  },
  host: "localhost:3000",
  schemes: ['http', 'https'],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    OAuth2: {
      type: "oauth2",
      flow: "accessCode",    // can also be "implicit" or "password" depending on your setup
      authorizationUrl: "https://auth-server.com/oauth/authorize",
      tokenUrl: "https://auth-server.com/oauth/token",
      scopes: {
        "read:students": "Read student data",
        "write:students": "Update student data",
        "read:courses": "Read course data",
        "write:courses": "Update course data",
        "read:instructors": "Read instructor data",
        "write:instructors": "Update instructor data"
      }
    }
  },
  security: [
    { OAuth2: ["read:students", "write:students", "read:courses", "write:courses", "read:instructors", "read:instructors"] }
  ],
  definitions: {
    StudentUpdate: {
      first_name: {
        type: "string",
        example: "OduduaZXY"
      },
      last_name: {
        type: "string",
        example: "YorubaXYZ"
      },
      email: {
        type: "string",
        format: "email",
        example: "abrahimttt.mukaila@example.com"
      },
      phone_number: {
        type: "string",
        example: "+234809870987"
      },
      course: {
        type: "string",
        example: "Medic"
      },
      enrollment_date: {
        type: "string",
        format: "date",
        example: "2020-11-20"
      },
      status: {
        type: "string",
        example: "Graduated"
      },
      gpa: {
        type: "number",
        format: "float",
        example: 4.0
      }
    }
  },
  paths: {
    "/students/update/{id}": {
      put: {
        tags: ["Students"],
        description: "Update an existing student",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            type: "string",
            description: "The student ID"
          },
          {
            name: "body",
            in: "body",
            required: true,
            description: "Student information to update",
            schema: { $ref: "#/definitions/StudentUpdate" }
          }
        ],
        responses: {
          200: {
            description: "Student successfully updated",
            schema: { $ref: "#/definitions/StudentUpdate" }
          },
          400: {
            description: "Bad request -  update data missing or invalid"
          },
          404: {
            description: "Student not found"
          }
        }
      }
    }
  }
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  // Load generated file
  const swagger = JSON.parse(fs.readFileSync(outputFile, "utf-8"));

  // --- Clean up duplicates ---
  Object.values(swagger.paths).forEach((methods) => {
    Object.values(methods).forEach((op) => {
      // Remove duplicate responses (swagger-autogen sometimes injects defaults)
      if (op.responses) {
        op.responses = {
          200: op.responses["200"] || { description: "OK" },
          400: op.responses["400"] || { description: "Bad Request" },
          404: op.responses["404"] || { description: "Not Found" }
        };
      }

      // Normalize requestBody for OpenAPI 3 (if you prefer modern style)
      if (op.parameters) {
        const bodyParam = op.parameters.find((p) => p.in === "body");
        if (bodyParam) {
          op.requestBody = {
            required: bodyParam.required,
            content: {
              "application/json": {
                schema: bodyParam.schema
              }
            }
          };
          // remove old-style body param
          op.parameters = op.parameters.filter((p) => p.in !== "body");
        }
      }
    });
  });

  // Save back cleaned file
  fs.writeFileSync(outputFile, JSON.stringify(swagger, null, 2));
  console.log("Swagger JSON cleaned and ready ✅");
});;
