const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse"); // Precisamos disso para tratar erros

// @desc    Registrar (criar) um novo usuário
// @route   POST /api/users/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { nomeCompleto, email, telefone, senha, confirmacaoSenha } = req.body;

  // Validação usando nossa classe de Erro customizada
  if (senha !== confirmacaoSenha) {
    return next(new ErrorResponse("As senhas não coincidem", 400));
  }

  const user = await User.create({
    nomeCompleto,
    email,
    telefone,
    senha,
  });

  sendTokenResponse(user, 201, res);
});

// @desc    Listar todos os usuários
// @route   GET /api/users
// @access  Privado (Protegido)
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  // O '.select' remove a senha do resultado.
  const users = await User.find().select("-senha");

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

// --- SÓ UMA VERSÃO DA FUNÇÃO HELPER É NECESSÁRIA ---

// Função helper para gerar e enviar o token na resposta
const sendTokenResponse = (user, statusCode, res) => {
  // Criar o token
  const token = user.getSignedJwtToken();

  // Opções do cookie (baseado no nosso .env)
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
    .cookie("token", token, options) // Envia o token como cookie
    .json({
      success: true,
      token, // Envia o token no corpo também
    });
};
