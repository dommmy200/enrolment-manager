// import fs from "fs"
// import swaggerAutogen from 'swagger-autogen'

// const doc = {
//   info: {
//     title: "School API",
//     description: "School student, instructors, and courses API"
//   },
//   host: "localhost:3000",
//   schemes: ['http', 'https'],
//   consumes: ["application/json"],
//   produces: ["application/json"],
//   securityDefinitions: {
//     BearerAuth: {
//       type: "apiKey",
//       name: "Authorization",
//       in: "header",
//       description: "Enter your JWT as: Bearer <token>"
//     }
//   },
//   security: [
//     { BearerAuth: [] }
//   ],
//   security: [
//     { OAuth2: ["read:students", "write:students", "read:courses", "write:courses", "read:instructors", "read:instructors"] }
//   ],
//   definitions: {
//     StudentUpdate: {
//       first_name: {
//         type: "string",
//         example: "OduduaZXY"
//       },
//       last_name: {
//         type: "string",
//         example: "YorubaXYZ"
//       },
//       email: {
//         type: "string",
//         format: "email",
//         example: "abrahimttt.mukaila@example.com"
//       },
//       phone_number: {
//         type: "string",
//         example: "+234809870987"
//       },
//       course: {
//         type: "string",
//         example: "Medic"
//       },
//       enrollment_date: {
//         type: "string",
//         format: "date",
//         example: "2020-11-20"
//       },
//       status: {
//         type: "string",
//         example: "Graduated"
//       },
//       gpa: {
//         type: "number",
//         format: "float",
//         example: 4.0
//       }
//     }
//   },
//   paths: {
//     "/students/update/{id}": {
//       put: {
//         tags: ["Students"],
//         description: "Update an existing student",
//         parameters: [
//           {
//             name: "id",
//             in: "path",
//             required: true,
//             type: "string",
//             description: "The student ID"
//           },
//           {
//             name: "body",
//             in: "body",
//             required: true,
//             description: "Student information to update",
//             schema: { $ref: "#/definitions/StudentUpdate" }
//           }
//         ],
//         security: [
//             {
//                 Bearer: ['write:students'] // Applies the Bearer scheme and documents required scope
//             }
//         ],
//         responses: {
//           200: {
//             description: "Student successfully updated",
//             schema: { $ref: "#/definitions/StudentUpdate" }
//           },
//           400: {
//             description: "Bad request -  update data missing or invalid"
//           },
//           404: {
//             description: "Student not found"
//           }
//         }
//       }
//     }
//   }
// };

// const outputFile = './swagger.json';
// const endpointsFiles = ['./routes/index.js'];

// swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
//   // Load generated file
//   const swagger = JSON.parse(fs.readFileSync(outputFile, "utf-8"));

//   // --- Clean up duplicates ---
//   Object.values(swagger.paths).forEach((methods) => {
//     Object.values(methods).forEach((op) => {
//       // Remove duplicate responses (swagger-autogen sometimes injects defaults)
//       if (op.responses) {
//         op.responses = {
//           200: op.responses["200"] || { description: "OK" },
//           400: op.responses["400"] || { description: "Bad Request" },
//           404: op.responses["404"] || { description: "Not Found" }
//         };
//       }

//       // Normalize requestBody for OpenAPI 3 (if you prefer modern style)
//       if (op.parameters) {
//         const bodyParam = op.parameters.find((p) => p.in === "body");
//         if (bodyParam) {
//           op.requestBody = {
//             required: bodyParam.required,
//             content: {
//               "application/json": {
//                 schema: bodyParam.schema
//               }
//             }
//           };
//           // remove old-style body param
//           op.parameters = op.parameters.filter((p) => p.in !== "body");
//         }
//       }
//     });
//   });

//   // Save back cleaned file
//   fs.writeFileSync(outputFile, JSON.stringify(swagger, null, 2));
//   console.log("Swagger JSON cleaned and ready ✅");
// });;

import fs from "fs"
import swaggerAutogen from "swagger-autogen"

const doc = {
  info: {
    title: "School API",
    description: "API for managing students, courses, and instructors",
    version: "1.0.0"
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],

  // JWT only
  securityDefinitions: {
    BearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Paste JWT as: Bearer <your_token>"
    }
  },
  security: [{ BearerAuth: [] }],

  definitions: {
    Course: {
      name: { type: "string", example: "Mathematics" },
      description: { type: "string", example: "Intro to Mathematics" },
      credits: { type: "integer", example: 3 },
      department: { type: "string", example: "Computer Science" },
      instructor_id: { type: "string", example: "68d87eb28b3ef5ea611c00bc" },
      semester: { type: "string", example: "Fall 2025" },
      status: { type: "string", example: "Active" },
      created_at: { type: "string", format: "date-time", example: "2025-09-27T10:15:00.000+00:00" },
      updated_at: { type: "string", format: "date-time", example: "2025-09-27T10:15:00.000+00:00" },
      prerequisite: { type: "array", example: ["math001", "chem010"]},
      
    },
    Student: {
      first_name: { type: "string", example: "OduduaZXY" },
      last_name: { type: "string", example: "YorubaXYZ" },
      email: { type: "string", example: "abrahimttt.mukaila@example.com" },
      phone_number: { type: "string", example: "+234809870987" },
      course: { type: "string", example: "Medic" },
      enrollment_date: { type: "string", format: "date", example: "2020-11-20" },
      status: { type: "string", example: "Graduated" },
      gpa: { type: "number", format: "float", example: 4.0 }
    },
    Instructor: {
      first_name: { type: "string", example: "Adewale" },
      last_name: { type: "string", example: "Ogunleye" },
      email: { type: "string", example: "adewale.ogunleye@example.com" },
      phone_number: { type: "string", example: "+234809870987" },
      course: { type: "string", example: "Medic" },
      department: { type: "string", example: "Computer Science" },
      hire_date: { type: "string", example: "20/01/2024" },
      status: { type: "string", example: "Active" }
    }
  }
}

const outputFile = "./swagger.json"
const endpointsFiles = ["./routes/index.js"]

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  const swagger = JSON.parse(fs.readFileSync(outputFile, "utf-8"))

  // --- Cleanup pass ---
  Object.values(swagger.paths).forEach((methods) => {
    Object.values(methods).forEach((op) => {
      // Normalize responses
      op.responses = {
        200: op.responses?.["200"] || { description: "OK" },
        201: op.responses?.["201"] || { description: "Created" },
        400: op.responses?.["400"] || { description: "Bad Request" },
        401: { description: "Unauthorized" },
        404: op.responses?.["404"] || { description: "Not Found" }
      }

      // Convert old-style body parameter → requestBody
      // if (op.parameters) {
      //   const bodyParam = op.parameters.find((p) => p.in === "body")
      //   if (bodyParam) {
      //     op.parameters = op.parameters.filter((p) => p.in !== "body")
      //     op.parameters.push({
      //       in: "body",
      //       name: "body",
      //       required: true,
      //       schema: bodyParam.schema
      //     })
      //   }
      // }
      if (op.parameters) {
        const bodyParam = op.parameters.find((p) => p.in === "body");
        if (bodyParam) {
          delete op.parameters; // remove old params
          op.requestBody = {
            required: true,
            content: {
              "application/json": {
                schema: bodyParam.schema
              }
            }
          };
        }
      }
    })
  })

  // if (op.parameters) {
  //   const bodyParam = op.parameters.find((p) => p.in === "body");
  //   if (bodyParam) {
  //     delete op.parameters; // remove old params
  //     op.requestBody = {
  //       required: true,
  //       content: {
  //         "application/json": {
  //           schema: bodyParam.schema
  //         }
  //       }
  //     };
  //   }
  // }
  //   });
  // });

  // --- Ensure only JWT is used ---
  swagger.securityDefinitions = {
    BearerAuth: doc.securityDefinitions.BearerAuth
  }
  swagger.security = doc.security

  fs.writeFileSync(outputFile, JSON.stringify(swagger, null, 2))
  console.log("✅ Swagger JSON generated and cleaned")
})
