const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const users = require("./routes/users");
const auth = require("./routes/auth");

// ==========================================
// VARIÁVEIS DE AMBIENTE
// ==========================================

dotenv.config({
  path: "./.env",
});

// ==========================================
// APP
// ==========================================

const app = express();

// ==========================================
// MIDDLEWARES GLOBAIS
// ==========================================

app.use(cors());

app.use(express.json());

// ==========================================
// HEALTH CHECK
// Não depende do MongoDB
// ==========================================

app.get("/", (req, res) => {
  return res
    .status(200)
    .send(
      "<h1>Aplicação funcionando 100%</h1>"
    );
});

// ==========================================
// CONEXÃO COM MONGODB
// Executada antes das rotas que usam banco
// ==========================================

app.use(
  async (req, res, next) => {
    try {
      await connectDB();

      next();
    } catch (err) {
      console.error(
        "Erro de conexão com MongoDB:",
        err
      );

      return res
        .status(500)
        .json({
          success: false,
          error:
            "Não foi possível conectar ao banco de dados.",
        });
    }
  }
);

// ==========================================
// ROTAS
// ==========================================

app.use(
  "/api/users",
  users
);

app.use(
  "/api/auth",
  auth
);

// ==========================================
// MIDDLEWARE GLOBAL DE ERROS
// Deve permanecer após as rotas
// ==========================================

app.use(errorHandler);

// ==========================================
// EXECUÇÃO LOCAL
// A Vercel utiliza module.exports = app
// ==========================================

if (
  process.env.VERCEL ===
  undefined
) {
  const PORT =
    process.env.PORT || 5000;

  const server =
    app.listen(
      PORT,
      () => {
        console.log(
          `Servidor rodando em modo ${process.env.NODE_ENV} na porta http://localhost:${PORT}`
        );
      }
    );

  process.on(
    "unhandledRejection",
    (err) => {
      console.error(
        `Erro: ${err.message}`
      );

      server.close(() =>
        process.exit(1)
      );
    }
  );
}

// ==========================================
// EXPORTAÇÃO PARA VERCEL
// ==========================================

module.exports = app;