export const createErrorResponse = (req, res, exception, statusCode) => {
  const data = {
    success: false,
    error: exception,
  };

  res.status(statusCode);

  return data;
};

export const createSuccessResponse = (req, res, data) => {
  const response = {
    success: true,
    data,
  };

  res.status(200);

  return response;
};
