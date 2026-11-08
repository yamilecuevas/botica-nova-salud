
const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
    minlength: [2, "El nombre debe tener al menos 2 caracteres"]
  },

  descripcion: {
    type: String,
    trim: true,
    default: ""
  },

  precio: {
    type: Number,
    required: [true, "El precio es obligatorio"],
    min: [0, "El precio no puede ser negativo"]
  },

  stock: {
    type: Number,
    required: [true, "El stock es obligatorio"],
    min: [0, "El stock no puede ser negativo"],
    validate: {
      validator: Number.isInteger,
      message: "El stock debe ser un número entero"
    }
  },

  stockMinimo: {
    type: Number,
    default: 5,
    min: [0, "El stock mínimo no puede ser negativo"],
    validate: {
      validator: Number.isInteger,
      message: "El stock mínimo debe ser un número entero"
    }
  },

  fechaVencimiento: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model(
  "Producto",
  productoSchema,
  "productos"
);
