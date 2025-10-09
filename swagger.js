// import fs from "fs"
// import swaggerAutogen from "swagger-autogen"

// const doc = {
//   info: {
//     title: "School API",
//     description: "API for managing students, courses, and instructors",
//     version: "1.0.0"
//   },
//   host: "localhost:3000",
//   basePath: "/",
//   schemes: ["http", "https"],
//   consumes: ["application/json"],
//   produces: ["application/json"],

//   // JWT only
//   securityDefinitions: {
//     BearerAuth: {
//       type: "apiKey",
//       name: "Authorization",
//       in: "header",
//       description: "Paste JWT as: Bearer <your_token>"
//     }
//   },
//   security: [{ BearerAuth: [] }],

//   definitions: {
//     Course: {
//       name: { type: "string", example: "Mathematics" },
//       description: { type: "string", example: "Intro to Mathematics" },
//       credits: { type: "integer", example: 3 },
//       department: { type: "string", example: "Computer Science" },
//       instructor_id: { type: "string", example: "68d87eb28b3ef5ea611c00bc" },
//       semester: { type: "string", example: "Fall 2025" },
//       status: { type: "string", example: "Active" },
//       created_at: { type: "string", format: "date-time", example: "2025-09-27T10:15:00.000+00:00" },
//       updated_at: { type: "string", format: "date-time", example: "2025-09-27T10:15:00.000+00:00" },
//       prerequisite: { type: "array", example: ["math001", "chem010"]},
      
//     },
//     Student: {
//       first_name: { type: "string", example: "OduduaZXY" },
//       last_name: { type: "string", example: "YorubaXYZ" },
//       email: { type: "string", example: "abrahimttt.mukaila@example.com" },
//       phone_number: { type: "string", example: "+234809870987" },
//       course: { type: "string", example: "Medic" },
//       enrollment_date: { type: "string", format: "date", example: "2020-11-20" },
//       status: { type: "string", example: "Graduated" },
//       gpa: { type: "number", format: "float", example: 4.0 }
//     },
//     Instructor: {
//       first_name: { type: "string", example: "Adewale" },
//       last_name: { type: "string", example: "Ogunleye" },
//       email: { type: "string", example: "adewale.ogunleye@example.com" },
//       phone_number: { type: "string", example: "+234809870987" },
//       course: { type: "string", example: "Medic" },
//       department: { type: "string", example: "Computer Science" },
//       hire_date: { type: "string", example: "20/01/2024" },
//       status: { type: "string", example: "Active" }
//     }
//   }
// }

// const outputFile = "./swagger.json"
// const endpointsFiles = ["./routes/index.js"]

// swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
//   const swagger = JSON.parse(fs.readFileSync(outputFile, "utf-8"))

//   // --- Cleanup pass ---
//   Object.values(swagger.paths).forEach((methods) => {
//     Object.values(methods).forEach((op) => {
//       // Normalize responses
//       op.responses = {
//         200: op.responses?.["200"] || { description: "OK" },
//         201: op.responses?.["201"] || { description: "Created" },
//         400: op.responses?.["400"] || { description: "Bad Request" },
//         401: { description: "Unauthorized" },
//         404: op.responses?.["404"] || { description: "Not Found" }
//       }
//       if (op.parameters) {
//         const bodyParam = op.parameters.find((p) => p.in === "body");
//         if (bodyParam) {
//           delete op.parameters; // remove old params
//           op.requestBody = {
//             required: true,
//             content: {
//               "application/json": {
//                 schema: bodyParam.schema
//               }
//             }
//           };
//         }
//       }
//     })
//   })

//   // --- Ensure only JWT is used ---
//   swagger.securityDefinitions = {
//     BearerAuth: doc.securityDefinitions.BearerAuth
//   }
//   swagger.security = doc.security

//   fs.writeFileSync(outputFile, JSON.stringify(swagger, null, 2))
//   console.log("✅ Swagger JSON generated and cleaned")
// })


import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: 'Enrollment Manager API',
    description: "API for managing students, courses, and instructors",
  },
  host: 'enrolment-manager.onrender.com/',
  schemes: ['https'],
};

const outputFile = './swagger.json'; // Output file for the generated Swagger documentation should be created in the root directory EMPTY
const routes = ['./routes/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);