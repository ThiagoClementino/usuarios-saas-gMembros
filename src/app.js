const express = require("express");
const dotenv = require("dotenv");

// CORREÇÃO: Os caminhos DEVEM começar com ./src
const connectDB = require("./src/config/db");
const errorHandler = require("./src/middleware/errorHandler");

dotenv.config({ path: "./.env" });

connectDB();

// CORREÇÃO: Os caminhos DEVEM começar com ./src
const users = require("./src/routes/users");
const auth = require("./src/routes/auth");

const app = express();
app.use(express.json());

// Rota de Health Check
app.get("/", (req, res) => {
  res.status(200).send("<h1>Aplicação funcionando 100%</h1>");
});

// Montar as rotas
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(errorHandler);

// Lógica de deploy (NÃO MUDAR)
if (process.env.VERCEL === undefined) {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(
      `Servidor rodando em modo ${process.env.NODE_ENV} na porta http://localhost:${PORT}`
    );
  });
  process.on("unhandledRejection", (err, promise) => {
    console.error(`Erro: ${err.message}`);
    server.close(() => process.exit(1));
  });
}

module.exports = app;
