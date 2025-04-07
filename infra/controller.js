import { InternalServerError, MethodNotAllowedError } from "./errors";

function onNoMatchHandler(request, response) {
  const publicError = new MethodNotAllowedError();
  response.status(publicError.statusCode).json(publicError);
}

function onErrorHandler(error, request, response) {
  const publicError = new InternalServerError({
    cause: error,
    statusCode: error.status_code,
  });
  console.log("Error in API handler next-connect");
  console.error(error);
  response.status(publicError.status_code).json(publicError);
}

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
