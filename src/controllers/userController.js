const User = require("../models/User");
const asyncHandler = require("../middleware/async"); // Importar

// @desc    Registrar (criar) um novo usuário
// @route   POST /api/users/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  // Tiramos o try...catch daqui

  const { nomeCompleto, email, telefone, senha, confirmacaoSenha } = req.body;

  if (senha !== confirmacaoSenha) {
    // (Aqui seria melhor criar uma classe de Erro customizada)
    return res
      .status(400)
      .json({ success: false, message: "As senhas não coincidem" });
  }

  const user = await User.create({
    nomeCompleto,
    email,
    telefone,
    senha,
  });

  sendTokenResponse(user, 201, res);
});

// Função helper (pode ficar no controller ou ir para utils)
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({
    success: true,
    token,
  });
};
