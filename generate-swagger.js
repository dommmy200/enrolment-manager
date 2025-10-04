// // generate-swagger.js
// import swaggerAutogen from 'swagger-autogen'
// import fs from 'fs'

// import path from 'path';                      // <-- NEW: Import path
// import { fileURLToPath } from 'url';          // <-- NEW: Import fileURLToPath

// // 1. Reconstruct __filename and __dirname equivalent for ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);  

// const outputFile = path.join(__dirname, 'swagger.json');
// const endpointsFiles = [path.join(__dirname, 'routes/index.js')];

// // Your doc: keep definitions and the paths/responses you want guaranteed.
// // (You can also require('./swaggerDoc') here if you keep it in a separate file.)
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
//     OAuth2: {
//       type: "oauth2",
//       flow: "accessCode",    // can also be "implicit" or "password" depending on your setup
//       authorizationUrl: "https://github.com/login/oauth/authorize",
//       tokenUrl: "https://github.com/login/oauth/access_token",
//       scopes: {
//         "read:students": "Read student data",
//         "write:students": "Update student data",
//         "read:courses": "Read course data",
//         "write:courses": "Update course data",
//         "read:instructors": "Read instructor data",
//         "write:instructors": "Update instructor data"
//       }
//     }
//   },
//   security: [
//     { BearerAuth: [] }  // default for all routes
//   ],
//   // SIMPLE examples-only style for swagger-autogen (it infers types from values)
//   definitions: {
//     StudentUpdate: {
//         first_name: "OduduaZXY",
//         last_name: "YorubaXYZ",
//         email: "abrahimttt.mukaila@example.com",
//         phone_number: "+234809870987",
//         course: "Medic",
//         enrollment_date: "2020-11-20",
//         status: "Graduated",
//         gpa: 4.0
//     },
//     CourseUpdate: {
//         course_name: "any",
//         description: "any",
//         credits: "any",
//         department: "any",
//         course: "any",
//         instructor: "any",
//         semester: "any"
//     },
//     InstructorUpdate: {
//         first_name: "any",
//         last_name: "any",
//         email: "any",
//         phone_number: "any",
//         course: "any",
//         department: "any",
//         hire_date: "any",
//         status: "any"
//     }
//   },

//   // This paths entry is the "source of truth" we'll merge into generated swagger.json
//   paths: {
//     "/students/update/{id}": {
//       put: {
//         tags: ["Students"],
//         description: "Update an existing student",
//         security: [{ BearerAuth: [] }],
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
//         responses: {
//           "200": {
//             description: "Student successfully updated",
//             schema: { $ref: "#/definitions/StudentUpdate" }
//           },
//           "400": { description: "Bad request - update data missing or invalid" },
//           "404": { description: "Student not found" },
//           "500": { description: "Internal Server Error" }
//         }
//       }
//     },
//      "/courses/update/{id}": {
//       put: {
//         tags: ["Courses"],
//         description: "Update an existing course",
//         security: [{ BearerAuth: [] }],
//         parameters: [
//           {
//             name: "id",
//             in: "path",
//             required: true,
//             type: "string",
//             description: "The course ID"
//           },
//           {
//             name: "body",
//             in: "body",
//             required: true,
//             description: "Courses information to update",
//             schema: { $ref: "#/definitions/CourseUpdate" }
//           }
//         ],
//         responses: {
//           "200": {
//             description: "Courses successfully updated",
//             schema: { $ref: "#/definitions/CourseUpdate" }
//           },
//           "400": { description: "Bad request - update data missing or invalid" },
//           "404": { description: "Courses not found" },
//           "500": { description: "Internal Server Error" }
//         }
//       }
//     },
//      "/instructors/update/{id}": {
//       put: {
//         tags: ["Instructors"],
//         description: "Update an existing instructor",
//         security: [{ BearerAuth: [] }],
//         parameters: [
//           {
//             name: "id",
//             in: "path",
//             required: true,
//             type: "string",
//             description: "The Instructor ID"
//           },
//           {
//             name: "body",
//             in: "body",
//             required: true,
//             description: "Instructor information to update",
//             schema: { $ref: "#/definitions/InstructorUpdate" }
//           }
//         ],
//         responses: {
//           "200": {
//             description: "Instructor successfully updated",
//             schema: { $ref: "#/definitions/InstructorUpdate" }
//           },
//           "400": { description: "Bad request - update data missing or invalid" },
//           "404": { description: "Instructor not found" },
//           "500": { description: "Internal Server Error" }
//         }
//       }
//     }
//   }
// };

// // Run swagger-autogen, then post-process generated swagger.json to merge doc.paths
// swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
//   try {
//     const generated = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

//     // Ensure generated.paths exists
//     generated.paths = generated.paths || {};

//     // For each path in doc.paths, merge into generated.paths
//     for (const docPath of Object.keys(doc.paths || {})) {
//       const docOps = doc.paths[docPath];
//       // Make sure the path exists in the generated file
//       generated.paths[docPath] = generated.paths[docPath] || {};

//       for (const op of Object.keys(docOps)) {
//         const docOp = docOps[op];                 // e.g. put, post
//         const method = op.toLowerCase();
//         generated.paths[docPath][method] = generated.paths[docPath][method] || {};
       
//         // inside the for (const op of Object.keys(docOps)) loop:
//         if (method === 'put' || method === 'post' || method === 'patch') {
//         // Guarantee body parameter
//         generated.paths[docPath][method].parameters =
//             generated.paths[docPath][method].parameters || [];

//         // remove any old body param
//         generated.paths[docPath][method].parameters =
//             generated.paths[docPath][method].parameters.filter(p => p.in !== 'body');

//         generated.paths[docPath][method].parameters.push({
//             name: "body",
//             in: "body",
//             required: true,
//             description: "Student information to update",
//             schema: { $ref: "#/definitions/StudentUpdate" }
//         });
//         }

//         // Overwrite description if present
//         if (docOp.description) {
//           generated.paths[docPath][method].description = docOp.description;
//         }

//         // Overwrite/replace parameters with the ones from doc
//         // if (docOp.parameters) {
//         //   generated.paths[docPath][method].parameters = docOp.parameters;
//         // }

//         // Instead of overwrite/replace parameters with the ones from doc just merge them
//         // if (docOp.parameters) {
//         //   generated.paths[docPath][method].parameters =
//         //     [...(generated.paths[docPath][method].parameters || []), ...docOp.parameters];
//         // }

//         if (docOp.parameters) {
//           const existing = generated.paths[docPath][method].parameters || [];

//           // Merge by replacing existing param with same (name+in)
//           const mergedParams = [...existing];

//           for (const newParam of docOp.parameters) {
//             const idx = mergedParams.findIndex(
//               p => p.name === newParam.name && p.in === newParam.in
//             );
//             if (idx >= 0) {
//               mergedParams[idx] = newParam; // overwrite existing
//             } else {
//               mergedParams.push(newParam);
//             }
//           }

//           generated.paths[docPath][method].parameters = mergedParams;
//         }

//         // if (docOp.parameters) {
//         //   // Ensure body param is preserved
//         //   const others = docOp.parameters.filter(p => p.in !== "body");
//         //   const bodyParam = generated.paths[docPath][method].parameters.find(p => p.in === "body");
//         //   generated.paths[docPath][method].parameters = [...others];
//         //   if (bodyParam) generated.paths[docPath][method].parameters.push(bodyParam);
//         // }

//         // Merge/overwrite responses
//         if (docOp.responses) {
//           generated.paths[docPath][method].responses = generated.paths[docPath][method].responses || {};
//           for (const code of Object.keys(docOp.responses)) {
//             // ensure codes are strings, e.g. "200"
//             const codeStr = String(code);
//             generated.paths[docPath][method].responses[codeStr] = docOp.responses[code];
//           }
//         }

//         // If you added tags or consumes/produces in doc, copy them too
//         if (docOp.tags) generated.paths[docPath][method].tags = docOp.tags;
//         if (docOp.consumes) generated.paths[docPath][method].consumes = docOp.consumes;
//         if (docOp.produces) generated.paths[docPath][method].produces = docOp.produces;
//       }
//     }

//     // Optionally merge definitions from doc into generated.definitions (do not overwrite existing)
//     generated.definitions = generated.definitions || {};
//     for (const defName of Object.keys(doc.definitions || {})) {
//       // If def already exists, skip or merge — here we overwrite to ensure our example is used
//       generated.definitions[defName] = doc.definitions[defName];
//     }

//     fs.writeFileSync(outputFile, JSON.stringify(generated, null, 2));
//     console.log('swagger.json generated and merged successfully.');
//   } catch (err) {
//     console.error('Error merging swagger.json:', err);
//   }
// }).catch(err => {
//   console.error('swagger-autogen failed:', err);
// });

// generate-swagger.js
import swaggerAutogen from 'swagger-autogen'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Reconstruct __filename and __dirname for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outputFile = path.join(__dirname, 'swagger.json')
const endpointsFiles = [path.join(__dirname, 'routes/index.js')]

// Swagger base doc
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
      flow: "accessCode",
      authorizationUrl: "https://github.com/login/oauth/authorize",
      tokenUrl: "https://github.com/login/oauth/access_token",
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
  security: [{ BearerAuth: [] }],
  definitions: {
    StudentUpdate: {
      first_name: "OduduaZXY",
      last_name: "YorubaXYZ",
      email: "abrahimttt.mukaila@example.com",
      phone_number: "+234809870987",
      course: "Medic",
      enrollment_date: "2020-11-20",
      status: "Graduated",
      gpa: 4.0
    },
    CourseUpdate: {
      course_name: "any",
      description: "any",
      credits: "any",
      department: "any",
      course: "any",
      instructor: "any",
      semester: "any"
    },
    InstructorUpdate: {
      first_name: "any",
      last_name: "any",
      email: "any",
      phone_number: "any",
      course: "any",
      department: "any",
      hire_date: "any",
      status: "any"
    }
  },
  paths: {
    "/students/update/{id}": {
      put: {
        tags: ["Students"],
        description: "Update an existing student",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, type: "string", description: "The student ID" },
          { name: "body", in: "body", required: true, description: "Student information to update", schema: { $ref: "#/definitions/StudentUpdate" } }
        ],
        responses: {
          "200": { description: "Student successfully updated", schema: { $ref: "#/definitions/StudentUpdate" } },
          "400": { description: "Bad request - update data missing or invalid" },
          "404": { description: "Student not found" },
          "500": { description: "Internal Server Error" }
        }
      }
    },
    "/courses/update/{id}": {
      put: {
        tags: ["Courses"],
        description: "Update an existing course",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, type: "string", description: "The course ID" },
          { name: "body", in: "body", required: true, description: "Course information to update", schema: { $ref: "#/definitions/CourseUpdate" } }
        ],
        responses: {
          "200": { description: "Course successfully updated", schema: { $ref: "#/definitions/CourseUpdate" } },
          "400": { description: "Bad request - update data missing or invalid" },
          "404": { description: "Course not found" },
          "500": { description: "Internal Server Error" }
        }
      }
    },
    "/instructors/update/{id}": {
      put: {
        tags: ["Instructors"],
        description: "Update an existing instructor",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, type: "string", description: "The instructor ID" },
          { name: "body", in: "body", required: true, description: "Instructor information to update", schema: { $ref: "#/definitions/InstructorUpdate" } }
        ],
        responses: {
          "200": { description: "Instructor successfully updated", schema: { $ref: "#/definitions/InstructorUpdate" } },
          "400": { description: "Bad request - update data missing or invalid" },
          "404": { description: "Instructor not found" },
          "500": { description: "Internal Server Error" }
        }
      }
    }
  }
}

// Run swagger-autogen, then merge
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  try {
    const generated = JSON.parse(fs.readFileSync(outputFile, 'utf8'))
    generated.paths = generated.paths || {}

    // Merge doc.paths into generated
    for (const [docPath, docMethods] of Object.entries(doc.paths)) {
      generated.paths[docPath] = generated.paths[docPath] || {}

      for (const [method, docOp] of Object.entries(docMethods)) {
        const lower = method.toLowerCase()
        generated.paths[docPath][lower] = {
          ...generated.paths[docPath][lower],
          ...docOp
        }

        // Deduplicate parameters by (name, in)
        if (docOp.parameters) {
          const existing = generated.paths[docPath][lower].parameters || []
          const mergedParams = [...existing]

          for (const newParam of docOp.parameters) {
            const idx = mergedParams.findIndex(
              (p) => p.name === newParam.name && p.in === newParam.in
            )
            if (idx >= 0) mergedParams[idx] = newParam
            else mergedParams.push(newParam)
          }
          generated.paths[docPath][lower].parameters = mergedParams
        }

        // Guarantee single body param for POST/PUT/PATCH
        if (["post", "put", "patch"].includes(lower)) {
          const params = generated.paths[docPath][lower].parameters || []
          const hasBody = params.some((p) => p.in === "body")
          if (!hasBody) {
            params.push({
              name: "body",
              in: "body",
              required: true,
              description: `${lower.toUpperCase()} body payload`,
              schema: { $ref: "#/definitions/StudentUpdate" }
            })
          }
          generated.paths[docPath][lower].parameters = params
        }

        // Merge responses
        if (docOp.responses) {
          generated.paths[docPath][lower].responses =
            generated.paths[docPath][lower].responses || {}
          for (const code of Object.keys(docOp.responses)) {
            generated.paths[docPath][lower].responses[String(code)] =
              docOp.responses[code]
          }
        }
      }
    }

    // Merge definitions
    generated.definitions = generated.definitions || {}
    for (const [defName, defValue] of Object.entries(doc.definitions)) {
      generated.definitions[defName] = defValue
    }

    fs.writeFileSync(outputFile, JSON.stringify(generated, null, 2))
    console.log("swagger.json generated and merged successfully ✅")
  } catch (err) {
    console.error("Error merging swagger.json:", err)
  }
}).catch(err => {
  console.error("swagger-autogen failed:", err)
})
