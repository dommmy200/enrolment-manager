// import express from "express";
// import swaggerJsdoc from "swagger-jsdoc";
// import swaggerUi from "swagger-ui-express";

// const router = express.Router();

// // Swagger definition (OpenAPI)
// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "School API",
//       version: "1.0.0",
//       description: "API for managing students, courses, and instructors",
//     },
//     servers: [{ url: "http://localhost:3000" }],
//     components: {
//       securitySchemes: {
//         BearerAuth: {
//           type: "http",
//           scheme: "bearer",
//           bearerFormat: "JWT",
//           description: "Enter JWT as: Bearer <token>",
//         },
//       },
//     },
//     security: [{ BearerAuth: [] }],
//   },
//   apis: ["./routes/*.js"], // Scan route files for Swagger annotations
// };

// // Generate Swagger spec from JSDoc comments
// const swaggerSpec = swaggerJsdoc(options);

// // Mount Swagger UI
// router.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerSpec, {
//     swaggerOptions: {
//       persistAuthorization: true, // ✅ keeps JWT after reload
//     },
//     customSiteTitle: "School API Docs", // optional branding
//   })
// );

// export default router;


// Import required modules

// const express = require('express');
// const router = express.Router();
// const swaggerUi = require('swagger-ui-express'); // Middleware for serving Swagger UI
// const swaggerDocument = require('../swagger.json'); // Swagger specification file (API documentation)

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const router = express.Router();

/**
 * ===================================
 * LOAD SWAGGER DOCUMENT
 * ===================================
 * Using fs.readFileSync ensures compatibility with all Node versions.
 * import assertions (assert { type: 'json' }) can cause issues depending
 * on Node version or runtime environment.
 */
const swaggerDocument = JSON.parse(
  fs.readFileSync(new URL('../swagger.json', import.meta.url))
);

/**
 * ===================================
 * SWAGGER DOCUMENTATION ROUTE
 * ===================================
 * This route serves the interactive Swagger UI documentation
 * for your API, allowing developers and testers to easily
 * explore and test available endpoints.
 */

// Serve Swagger UI at /api-docs
router.use('/api-docs', swaggerUi.serve);
router.use('/api-docs', swaggerUi.setup(swaggerDocument));

/**
 * ===================================
 * EXPORT ROUTER
 * ===================================
 * Exports this router so it can be mounted in the main routes index.js file.
 */
export default router;
