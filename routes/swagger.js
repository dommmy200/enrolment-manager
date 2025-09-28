import express from 'express'
const router = express.Router();

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerDocument = require("../swagger.json");

import swaggerUi from 'swagger-ui-express'

// router.use('/api-docs', swaggerUi.serve)
router.use('/api-docs', swaggerUi.serve,
    swaggerUi.setup(swaggerDocument),
    swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            oauth2RedirectUrl: "http://localhost:3000/api-docs/oauth2-redirect.html"
        }
    })
);

export default router