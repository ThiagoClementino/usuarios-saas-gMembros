const express = require("express");
const {
  login,
  forgotPassword,
  resetPassword,
  getMe,
} = require("../controllers/authController");

// Importar o middleware de proteção
const { protect } = require("../middleware/auth");

const router = express.Router();

// --- Rotas Públicas ---
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);

// --- Rotas Privadas (Protegidas) ---
// O middleware 'protect' será executado antes do 'getMe'
router.get("/me", protect, getMe);

module.exports = router;
