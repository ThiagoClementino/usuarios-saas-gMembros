const express = require("express");
const dotenv = require("dotenv");

// --- CORREÇÃO AQUI ---
// Removemos o "./src/" porque já estamos dentro da pasta src
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config({ path: "./.env" }); // O .env está na raiz, então este caminho está certo

connectDB();

// --- CORREÇÃO AQUI ---
// Removemos o "./src/"
const users = require("./routes/users");
const auth = require("./routes/auth");

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
