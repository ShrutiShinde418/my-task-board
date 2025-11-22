import { z } from "zod";
import constants from "../utils/constants.js";
import { handleValidationErrors } from "../utils/helperMethods.js";

export const authRequestMapper = async (req) => {
  try {
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

    return schema.parseAsync(req.body);
  } catch (e) {
    handleValidationErrors(e, req.transactionId);
  }
};
