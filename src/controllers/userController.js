const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");

// @desc    Registrar (criar) um novo usuário
// @route   POST /api/users/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { nomeCompleto, email, telefone, senha, confirmacaoSenha } = req.body;

  // Validação de negócio (usando nossa classe de erro)
  if (senha !== confirmacaoSenha) {
    return next(new ErrorResponse("As senhas não coincidem", 400));
  }

  // Criar usuário (o 'pre-save' no Model fará o hash da senha)
  // O errorHandler pegará erros do Mongoose (ex: e-mail duplicado)
  const user = await User.create({
    nomeCompleto,
    email,
    telefone,
    senha,
  });

  // Enviar o token para o usuário logar automaticamente
  sendTokenResponse(user, 201, res);
});

// Função helper para gerar e enviar o token na resposta
const sendTokenResponse = (user, statusCode, res) => {
  // Criar o token
  const token = user.getSignedJwtToken();

  // Opções do cookie (opcional, mas recomendado para web)
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Impede que o cookie seja acessado por JS no cliente
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true; // Só enviar em HTTPS
  }

  res
    .status(statusCode)
    .cookie("token", token, options) // Opcional: envia o token como cookie
    .json({
      success: true,
      token, // Envia o token no corpo também
    });
};
