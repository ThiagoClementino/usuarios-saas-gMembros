const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const users = require("./routes/users");
const auth = require("./routes/auth");

// 1. Carregar variáveis de ambiente
dotenv.config({ path: "./.env" });

// 2. Conectar ao banco de dados
connectDB();

// 3. CRIAR o app (AQUI)
const app = express();

// 4. USAR os middlewares (AGORA SIM)
// O app.use(cors()) deve vir aqui, DEPOIS de 'const app'
app.use(cors());
app.use(express.json());

// 5. Montar as rotas
// Rota de Health Check
app.get("/", (req, res) => {
  res.status(200).send("<h1>Aplicação funcionando 100%</h1>");
});

app.use("/api/users", users);
app.use("/api/auth", auth);

// 6. Middleware de Erro (deve ser o último 'app.use')
app.use(errorHandler);

// 7. Lógica de deploy (NÃO MUDAR)
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
