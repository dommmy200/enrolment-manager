// import express from 'express'
// const router = express.Router();

// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const swaggerDocument = require("../swagger.json");

// import swaggerUi from 'swagger-ui-express'

// // router.use('/api-docs', swaggerUi.serve)
// router.use('/api-docs', swaggerUi.serve,
//     swaggerUi.setup(swaggerDocument),
//     swaggerUi.setup(swaggerDocument, {
//         swaggerOptions: {
//             oauth2RedirectUrl: "http://localhost:3000/api-docs/oauth2-redirect.html"
//         }
//     })
// );

// export default router

import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const router = express.Router();

// Swagger definition (OpenAPI)
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "School API",
      version: "1.0.0",
      description: "API for managing students, courses, and instructors",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT as: Bearer <token>",
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ["./routes/*.js"], // Scan route files for Swagger annotations
};

// Generate Swagger spec from JSDoc comments
const swaggerSpec = swaggerJsdoc(options);

// Mount Swagger UI
router.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true, // ✅ keeps JWT after reload
    },
    customSiteTitle: "School API Docs", // optional branding
  })
);

export default router;
