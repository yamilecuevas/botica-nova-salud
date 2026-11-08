
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Producto = require("./models/Producto");

const app = express();

app.use(cors());
app.use(express.json());

// CONEXIÓN A MONGODB
mongoose.connect("mongodb://127.0.0.1:27017/botica_nova_salud")
  .then(() => console.log("MongoDB conectado correctamente"))
  .catch(error => console.log("Error de conexión:", error));

// MODELO DE VENTAS
const ventaSchema = new mongoose.Schema({
  medicamentoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Producto",
    required: true
  },
  medicamento: {
    type: String,
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  precioUnitario: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

const Venta = mongoose.models.Venta ||
  mongoose.model("Venta", ventaSchema, "ventas");

// RUTA PRINCIPAL
app.get("/", (req, res) => {
  res.send("Servidor de Botica Nova Salud funcionando");
});

// CONSULTAR MEDICAMENTOS
app.get("/productos", async (req, res) => {
  try {
    const productos = await Producto.find().sort({ nombre: 1 });
    res.json(productos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al consultar medicamentos"
    });
  }
});

// REGISTRAR MEDICAMENTO
app.post("/productos", async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();

    res.status(201).json({
      mensaje: "Medicamento registrado correctamente",
      producto
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al registrar medicamento",
      error: error.message
    });
  }
});

// ACTUALIZAR MEDICAMENTO
app.put("/productos/:id", async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!producto) {
      return res.status(404).json({
        mensaje: "Medicamento no encontrado"
      });
    }

    res.json({
      mensaje: "Medicamento actualizado correctamente",
      producto
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar medicamento",
      error: error.message
    });
  }
});

// ELIMINAR MEDICAMENTO
app.delete("/productos/:id", async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(
      req.params.id
    );

    if (!producto) {
      return res.status(404).json({
        mensaje: "Medicamento no encontrado"
      });
    }

    res.json({
      mensaje: "Medicamento eliminado correctamente"
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar medicamento"
    });
  }
});

// CONSULTAR HISTORIAL DE VENTAS
app.get("/ventas", async (req, res) => {
  try {
    const ventas = await Venta.find().sort({ fecha: -1 });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al consultar ventas"
    });
  }
});

// REGISTRAR VENTA
app.post("/ventas", async (req, res) => {
  try {
    const { medicamentoId, cantidad } = req.body;
    const unidades = Number(cantidad);

    if (
      !mongoose.isValidObjectId(medicamentoId) ||
      !Number.isInteger(unidades) ||
      unidades <= 0
    ) {
      return res.status(400).json({
        mensaje: "Seleccione un medicamento y una cantidad válida"
      });
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    // Descontar stock solo si hay unidades y no está vencido
    const producto = await Producto.findOneAndUpdate(
      {
        _id: medicamentoId,
        stock: { $gte: unidades },
        $or: [
          { fechaVencimiento: { $gt: hoy } },
          { fechaVencimiento: null },
          { fechaVencimiento: { $exists: false } }
        ]
      },
      {
        $inc: { stock: -unidades }
      },
      {
        new: false,
        runValidators: true
      }
    );

    if (!producto) {
      return res.status(400).json({
        mensaje:
          "No se puede vender: medicamento vencido, inexistente o sin stock suficiente"
      });
    }

    const total = Number(
      (producto.precio * unidades).toFixed(2)
    );

    const venta = new Venta({
      medicamentoId: producto._id,
      medicamento: producto.nombre,
      cantidad: unidades,
      precioUnitario: producto.precio,
      total
    });

    try {
      await venta.save();
    } catch (error) {
      // Restaurar el stock si falla el registro de la venta
      await Producto.findByIdAndUpdate(
        producto._id,
        { $inc: { stock: unidades } }
      );

      throw error;
    }

    res.status(201).json({
      mensaje: "Venta registrada correctamente",
      venta
    });

  } catch (error) {
    res.status(500).json({
      mensaje: "Error al registrar venta",
      error: error.message
    });
  }
});

// INICIAR SERVIDOR
app.listen(3000, () => {
  console.log("Servidor funcionando en http://localhost:3000");
});
