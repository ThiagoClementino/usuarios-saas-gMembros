// src/utils/ErrorResponse.js
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message); // Passa a 'message' para a classe 'Error' pai
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
