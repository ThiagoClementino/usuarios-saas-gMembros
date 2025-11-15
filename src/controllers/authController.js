const crypto = require("crypto");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/ErrorResponse");
const sendEmail = require("../utils/sendEmail");

// @desc    Logar usuário
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, senha } = req.body;

  // 1. Validar se e-mail e senha foram enviados
  if (!email || !senha) {
    return next(new ErrorResponse("Por favor, informe e-mail e senha", 400));
  }

  // 2. Buscar usuário pelo e-mail
  //    Usamos .select('+senha') para forçar o Mongoose a incluir a senha
  const user = await User.findOne({ email }).select("+senha");

  // 3. Se o usuário não existir (respeitando a segurança)
  if (!user) {
    return next(new ErrorResponse("Credenciais inválidas", 401));
  }

  // 4. Verificar se a senha bate (usando o método do Model)
  const isMatch = await user.matchPassword(senha);

  if (!isMatch) {
    return next(new ErrorResponse("Credenciais inválidas", 401));
  }

  // 5. Enviar o token
  sendTokenResponse(user, 200, res);
});

// @desc    Buscar dados do usuário logado
// @route   GET /api/auth/me
// @access  Privado
exports.getMe = asyncHandler(async (req, res, next) => {
  // O middleware 'protect' já anexou o usuário ao 'req.user'
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Solicitar recuperação de senha (Forgot Password)
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  // Resposta genérica por segurança
  if (!user) {
    return res
      .status(200)
      .json({ success: true, data: "E-mail enviado (se o usuário existir)" });
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/resetpassword/${resetToken}`;
  const message = `Você solicitou uma redefinição de senha. Clique neste link: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Redefinição de Senha",
      message,
    });

    res.status(200).json({ success: true, data: "E-mail enviado" });
  } catch (err) {
    console.error(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Não foi possível enviar o e-mail", 500));
  }
});

// @desc    Redefinir a senha (Reset Password)
// @route   POST /api/auth/resetpassword/:token
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Hashear o token da URL para comparar com o do banco
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Token inválido ou expirado", 400));
  }

  // Definir nova senha e limpar campos de reset
  user.senha = req.body.senha;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save(); // O 'pre-save' hook fará o hash da nova senha

  // Logar o usuário automaticamente
  sendTokenResponse(user, 200, res);
});

// --- FUNÇÃO HELPER DE TOKEN ---
// (Duplicada aqui para manter o controller autocontido)
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
