/**
 * Validation rules for Actor data.
 * Ensures all required fields are present and correctly formatted.
 */
import { validationResult } from 'express-validator';
import { body } from 'express-validator';

/**
 * ===================================
 * COURSE VALIDATION RULES
 * ===================================
 * Ensures that course data provided in the request body
 * meets expected types, formats, and completeness.
 */
export const courseRules = () => {
  return [
    body('course_name')
      .notEmpty()
      .isString()
      .withMessage('Course name must be a non-empty string'),

    body('description')
      .notEmpty()
      .isString()
      .withMessage('Description must be a non-empty string'),

    body('credits')
      .notEmpty()
      .isNumeric()
      .withMessage('Credits must be a numeric value'),

    body('department')
      .notEmpty()
      .isString()
      .withMessage('Department must be a non-empty string'),

    body('course')
      .notEmpty()
      .isString()
      .withMessage('Course code or reference must be a non-empty string'),

    body('instructor')
      .notEmpty()
      .isString()
      .withMessage('Instructor must be a valid string'),

    body('semester')
      .notEmpty()
      .isString()
      .withMessage('Semester must be a non-empty string'),
  ];
};


/**
 * ===================================
 * INSTRUCTOR VALIDATION RULES
 * ===================================
 * Ensures that instructor data from the request body
 * is valid, complete, and properly formatted.
 */
export const instructorRules = () => {
  return [
    body('first_name')
      .notEmpty()
      .isString()
      .withMessage('First name must be a non-empty string'),

    body('last_name')
      .notEmpty()
      .isString()
      .withMessage('Last name must be a non-empty string'),

    body('email')
      .notEmpty()
      .isEmail()
      .withMessage('Email must be a valid email address'),

    body('phone_number')
      .optional()
      .isMobilePhone()
      .withMessage('Phone number must be a valid mobile number'),

    body('course')
      .notEmpty()
      .isString()
      .withMessage('Course must be a non-empty string'),

    body('department')
      .notEmpty()
      .isString()
      .withMessage('Department must be a non-empty string'),

    body('hire_date')
      .notEmpty()
      .isISO8601()
      .withMessage('Hire date must be a valid ISO 8601 date'),

    body('status')
      .notEmpty()
      .isIn(['active', 'inactive'])
      .withMessage('Status must be either "active" or "inactive"'),
  ];
};

/**
 * ===================================
 * STUDENT VALIDATION RULES
 * ===================================
 * Ensures that student data from the request body
 * is valid, well-formed, and complete.
 */
export const studentRules = () => {
  return [
    body('first_name')
      .notEmpty()
      .isString()
      .withMessage('First name must be a non-empty string'),

    body('last_name')
      .notEmpty()
      .isString()
      .withMessage('Last name must be a non-empty string'),

    body('email')
      .notEmpty()
      .isEmail()
      .withMessage('Email must be a valid email address'),

    body('phone_number')
      .optional()
      .isMobilePhone()
      .withMessage('Phone number must be a valid mobile number'),

    body('course')
      .notEmpty()
      .isString()
      .withMessage('Course must be a non-empty string'),

    body('enrolment_date')
      .notEmpty()
      .isISO8601()
      .withMessage('Enrolment date must be a valid ISO 8601 date'),

    body('status')
      .notEmpty()
      .isIn(['active', 'inactive', 'suspended'])
      .withMessage('Status must be one of: "active", "inactive", or "suspended"'),

    body('gpa')
      .optional()
      .isFloat({ min: 0.0, max: 5.0 })
      .withMessage('GPA must be a number between 0.0 and 5.0'),
  ];
};

/**
 * Middleware to process and handle validation errors.
 * If validation fails, responds with a 400 Bad Request and the list of errors.
 * If validation passes, the request proceeds to the next middleware or route handler.
 */
export const validate = (req, res, next) => {
    const errors = validationResult(req);

    // If there are validation errors, return them to the client
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Continue to the next middleware or controller
    next();
};

// // Export all validation rule sets and the error handler
// export default  {
//     courseRules,
//     instructorRules,
//     studentRules,
//     validate 
// };
