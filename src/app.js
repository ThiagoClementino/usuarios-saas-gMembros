const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config({ path: "./.env" });

connectDB();

// Importar rotas
const users = require("./routes/users");
const auth = require("./routes/auth");

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.send(`API Rodando normalmente`);
});

app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(errorHandler);

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

// Exporta o app para a Vercel usar como função serverless
module.exports = app;
