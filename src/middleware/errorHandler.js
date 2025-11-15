const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err }; // Cria uma cópia do objeto 'err'
  error.message = err.message;

  // Log de desenvolvimento
  console.error(err.stack);
  console.log(err); // Log para ver os tipos de erro

  // --- Tratando Erros Específicos do Mongoose ---

  // 1. Mongoose: ID mal formatado (CastError)
  if (err.name === "CastError") {
    const message = `Recurso não encontrado. ID inválido: ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // 2. Mongoose: Chave duplicada (E-mail)
  if (err.code === 11000) {
    const message = "Este e-mail já está cadastrado";
    error = new ErrorResponse(message, 400);
  }

  // 3. Mongoose: Erro de validação (Campos obrigatórios)
  if (err.name === "ValidationError") {
    // Pega as mensagens de erro de validação e formata
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = new ErrorResponse(message, 400);
  }

  // --- Resposta Final ---
  // Envia a resposta usando o statusCode do nosso 'ErrorResponse'
  // ou usa 500 (Internal Server Error) como padrão.
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Erro Interno do Servidor",
  });
};

module.exports = errorHandler;
