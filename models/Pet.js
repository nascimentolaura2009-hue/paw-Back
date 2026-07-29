import mongoose from "mongoose";

const PetSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    especie: {
      type: String,
      required: true,
      trim: true,
    },
    tipo: {
      type: String,
      trim: true,
    },
    idade: {
      type: Number,
    },
    descricao: {
      type: String,
      trim: true,
    },
    imagem: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["disponivel", "adotado", "perdido"],
      default: "disponivel",
    },
  },
  {
    timestamps: true,
  }
);

// Garantir que tipo seja sincronizado com especie caso não informado
PetSchema.pre("save", function (next) {
  if (!this.tipo && this.especie) {
    this.tipo = this.especie;
  }
  next();
});

export default mongoose.model("Pet", PetSchema);