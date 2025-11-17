const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // Módulo nativo do Node

const UserSchema = new mongoose.Schema({
  nomeCompleto: {
    type: String,
    required: [true, "Por favor, adicione um nome completo"],
  },
  email: {
    type: String,
    required: [true, "Por favor, adicione um e-mail"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Por favor, adicione um e-mail válido",
    ],
  },
  telefone: {
    type: String,
    required: [true, "Por favor, adicione um telefone"],
  },
  senha: {
    type: String,
    required: [true, "Por favor, adicione uma senha"],
    minlength: 6,
    select: false, // Não retorna a senha nas queries por padrão
  },
  // Campos para recuperação de senha
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// --- HOOKS DO MONGOOSE ---

// Hook: Criptografar a senha ANTES de salvar (pre-save)
UserSchema.pre("save", async function (next) {
  // Só executa se a senha foi modificada (ou é nova)
  if (!this.isModified("senha")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.senha' estará disponível aqui pois o 'select: false' não se aplica
  return await bcrypt.compare(enteredPassword, this.senha);
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // 4. Retornar o token em texto puro (para enviar por e-mail)
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
