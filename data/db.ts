import mongoose from "mongoose";

export async function connectDB(uri: string) {
  try {
    await mongoose.connect(uri);
    console.log("Conectado a MongoDB");
  } catch (err) {
    console.error("Error al conectar con Mongo:", err);
    process.exit(1);
  }
}
