/**
 * @file        schemaHelper.js
 * @description AJV schema validation helper for API response bodies.
 * @purpose     Provides a reusable wrapper around AJV compile/validate
 *              so tests get clear, human-readable error messages instead
 *              of cryptic boolean failures.
 * @author      Bhuvesh Yadav
 * @github      https://github.com/bhuvesh75
 */

// Import AJV — the industry-standard JSON Schema validator
const Ajv = require('ajv');
// Import AJV formats addon to support 'email' and 'uri' format validations
const addFormats = require('ajv-formats');

/**
 * @function    validateSchema
 * @description Validates a JSON object against an AJV-compatible schema.
 *              Throws a detailed error listing every validation failure
 *              so the developer can fix all problems in one pass rather
 *              than discovering them one at a time.
 * @param       {object} data   - Parsed JSON response body to validate
 * @param       {object} schema - AJV-compatible JSON Schema object
 * @returns     {boolean} true if the data conforms to the schema
 * @throws      {Error} Descriptive error listing all AJV validation errors
 * @example     validateSchema(response.body, userSchema)
 */
function validateSchema(data, schema) {
  // Create a new AJV instance with allErrors enabled — collect ALL errors, not just the first
  const ajv = new Ajv({ allErrors: true });

  // Attach format validators so 'email' and 'uri' formats are recognised
  addFormats(ajv);

  // Compile the schema into a reusable validator function
  const validate = ajv.compile(schema);

  // Run the validator against the response data
  const isValid = validate(data);

  // If validation fails, format all errors into a readable message
  if (!isValid) {
    const errors = validate.errors
      .map((e) => `  • ${e.instancePath || '(root)'} ${e.message}`)
      .join('\n');
    throw new Error(`Schema validation failed:\n${errors}`);
  }

  // Return true so callers can use the result in assertions if needed
  return true;
}

module.exports = { validateSchema };
