/*
 * Este "wrapper" captura erros em rotas assíncronas
 * e os passa para o próximo middleware (nosso errorHandler).
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next); // Passa o erro para o próximo middleware

module.exports = asyncHandler;
