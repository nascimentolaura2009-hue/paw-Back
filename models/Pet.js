import mongoose from "mongoose";

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Pet name is required"],
      trim: true,
    },
    species: {
      type: String,
      required: [true, "Pet species is required"],
      trim: true,
    },
    breed: {
      type: String,
      default: "Misto / Vira-lata",
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
      min: [0, "Age cannot be negative"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Macho", "Fêmea", "Other"],
      default: "Male",
    },
    size: {
      type: String,
      enum: ["Small", "Medium", "Large", "Pequeno", "Médio", "Grande"],
      default: "Medium",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["available", "adopted", "lost", "disponivel", "adotado", "perdido"],
      default: "available",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual aliases para garantir retrocompatibilidade com campos em Português e variações de imagem
petSchema.virtual("nome").get(function () {
  return this.name;
});
petSchema.virtual("especie").get(function () {
  return this.species;
});
petSchema.virtual("tipo").get(function () {
  return this.species;
});
petSchema.virtual("idade").get(function () {
  return this.age;
});
petSchema.virtual("descricao").get(function () {
  return this.description;
});
petSchema.virtual("imagem").get(function () {
  return this.image;
});
petSchema.virtual("imageUrl").get(function () {
  return this.image;
});
petSchema.virtual("foto").get(function () {
  return this.image;
});

const Pet = mongoose.model("Pet", petSchema);

export default Pet;