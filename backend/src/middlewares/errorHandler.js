import { v4 as uuidv4 } from "uuid";
import ErrorResponse from "../utils/ErrorResponse.js";
import Constants from "../utils/constants.js";
import { createErrorResponse } from "../models/responseMapper.js";

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;
  if (err instanceof SyntaxError && "body" in err) {
    req.transactionID = uuidv4();
    req.txnStart = Date.now();

    return res.send(
      createErrorResponse(
        req,
        res,
        new ErrorResponse(Constants.INVALID_JSON, 422),
        400
      )
    );
  }

  if (err instanceof ErrorResponse) {
    return res.send(createErrorResponse(req, res, error, 400));
  }

  if (err instanceof Error) {
    return res.send(
      createErrorResponse(
        req,
        res,
        new ErrorResponse(Constants.INTERNAL_COMMUNICATION_EXCEPTION, 500),
        500
      )
    );
  }
};

export default errorHandler;
