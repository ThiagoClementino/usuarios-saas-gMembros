const mongoose =
  require("mongoose");

let connectionPromise = null;

const connectDB = async () => {
  if (
    mongoose.connection
      .readyState === 1
  ) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error(
      "Variável MONGO_URI não configurada."
    );
  }

  if (!connectionPromise) {
    connectionPromise =
      mongoose
        .connect(
          process.env.MONGO_URI
        )
        .catch((err) => {
          connectionPromise = null;

          throw err;
        });
  }

  await connectionPromise;

  return mongoose.connection;
};

module.exports = connectDB;