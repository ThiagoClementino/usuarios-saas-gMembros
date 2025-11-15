const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/ErrorResponse");
const User = require("../models/User");

// Middleware para proteger rotas
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Verificar se o token está no header (padrão 'Bearer')
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Formato: 'Bearer TOKEN_AQUI'
    token = req.headers.authorization.split(" ")[1];
  }
  // (Opcional: verificar se o token está nos cookies)
  // else if (req.cookies.token) {
  //    token = req.cookies.token;
  // }

  // 2. Garantir que o token existe
  if (!token) {
    return next(new ErrorResponse("Não autorizado a acessar esta rota", 401));
  }

  try {
    // 3. Verificar (decodificar) o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Encontrar o usuário pelo ID do token e anexar ao 'req'
    //    O '.select' garante que a senha (que tem 'select: false') não venha.
    req.user = await User.findById(decoded.id).select("-senha");

    if (!req.user) {
      return next(new ErrorResponse("Usuário não encontrado", 404));
    }

    next(); // Próximo middleware
  } catch (err) {
    // Se o token for inválido (expirado, etc.)
    return next(new ErrorResponse("Não autorizado, token inválido", 401));
  }
});
