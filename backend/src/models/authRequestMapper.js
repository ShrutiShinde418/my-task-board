import { z } from "zod";
import constants from "../utils/constants.js";
import { handleValidationErrors } from "../utils/helperMethods.js";

/**
 * Request Mapper for signup and login controllers
 *
 * Validates the request body of signup and login controllers which contain 2 parameters, email and password, using zod. If any invalid parameters are present, errors are thrown accordingly.
 *
 * @param {import('express').Request} req - Express Request Object.
 */
export const authRequestMapper = async (req) => {
  try {
    logger.debug(
      `${req.transactionID} Validating the request body with email: ${req.body.email}`,
    );

    const schema = z.strictObject(
      {
        email: z
          .email({
            pattern: z.regexes.rfc5322Email,
            error: "Please enter a valid email address.",
          })
          .trim(),
        password: z
          .string()
          .trim()
          .regex(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            {
              error:
                "Password should have minimum eight characters, at least one letter, one number and one special character",
            },
          ),
      },
      { error: constants.UNKNOWN_PARAMETERS },
    );

    return await schema.parseAsync(req.body);
  } catch (e) {
    logger.error(
      `${req.transactionID} Error occurred while validating the request body: ${e}, ${JSON.stringify(e)}`,
    );

    handleValidationErrors(e, req.transactionID);
  }
};
