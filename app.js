const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");

// Carregar variáveis de ambiente (DEVE VIR ANTES DE TUDO)
dotenv.config({ path: "./.env" });

// Conectar ao banco de dados
connectDB();

// Importar rotas
const users = require("./src/routes/users");
const auth = require("./src/routes/auth");

const app = express();

// Middleware para parsear o body (req.body) em JSON
app.use(express.json());

// Montar as rotas
app.use("/api/users", users);
app.use("/api/auth", auth);

// Middleware de Tratamento de Erros (DEVE SER O ÚLTIMO)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Servidor rodando em modo ${process.env.NODE_ENV} na porta ${PORT}`
  );
});

// Lidar com 'Promise rejections' não tratadas
process.on("unhandledRejection", (err, promise) => {
  console.error(`Erro: ${err.message}`);
  // Fechar o servidor e sair
  server.close(() => process.exit(1));
});
