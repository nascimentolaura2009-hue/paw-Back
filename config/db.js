import mongoose from "mongoose";

let isConnecting = false;

const conectarBanco = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    console.log("⏳ Conexão com MongoDB já em andamento...");
    return;
  }

  isConnecting = true;
  const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pawconnect";

  const mongooseOptions = {
    serverSelectionTimeoutMS: 15000, // Timeout de 15s para tolerar Cold Start no Render
    connectTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    heartbeatFrequencyMS: 10000,
    maxPoolSize: 10,
  };

  // Event Listeners de Monitoramento de Estado
  mongoose.connection.on("connected", () => {
    console.log("🟢 [MONGODB]: Conexão estabelecida com sucesso!");
    isConnecting = false;
  });

  mongoose.connection.on("error", (err) => {
    console.error("🔴 [MONGODB ERROR]: Falha na conexão com o banco:", err.message);
    isConnecting = false;
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ [MONGODB WARN]: Conexão perdida. Tentando reconectar...");
    isConnecting = false;
  });

  try {
    console.log("🔄 [MONGODB]: Conectando ao cluster do banco de dados...");
    await mongoose.connect(mongoURI, mongooseOptions);
    return mongoose.connection;
  } catch (erro) {
    console.error("❌ [MONGODB CRITICAL]: Erro ao conectar ao MongoDB:", erro.message);
    isConnecting = false;
  }
};

export default conectarBanco;