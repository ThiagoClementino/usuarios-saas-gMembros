const mongoose = require("mongoose");

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Variável MONGO_URI não configurada.");
  }

  if (!connectionPromise) {
    // Compartilha a tentativa em andamento e libera o cache ao terminar.
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .finally(() => {
        connectionPromise = null;
      });
  }

  await connectionPromise;

  return mongoose.connection;
};

module.exports = connectDB;