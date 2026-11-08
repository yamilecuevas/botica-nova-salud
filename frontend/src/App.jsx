
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Menu from "./components/Menu";
import Inicio from "./pages/Inicio";
import Medicamentos from "./pages/Medicamentos";
import Ventas from "./pages/Ventas";
import Historial from "./pages/Historial";

import "./App.css";

const API = "http://localhost:3000";

function App() {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);

  const mostrarMensaje = (texto, esError = false) => {
    setMensaje(texto);
    setError(esError);
  };

  const cargarProductos = async () => {
    try {
      const respuesta = await fetch(`${API}/productos`);

      if (!respuesta.ok) {
        throw new Error("Error al cargar medicamentos");
      }

      const datos = await respuesta.json();
      setProductos(datos);
    } catch (err) {
      mostrarMensaje(err.message, true);
    }
  };

  const cargarVentas = async () => {
    try {
      const respuesta = await fetch(`${API}/ventas`);

      if (!respuesta.ok) {
        throw new Error("Error al cargar ventas");
      }

      const datos = await respuesta.json();
      setVentas(datos);
    } catch (err) {
      mostrarMensaje(err.message, true);
    }
  };

  useEffect(() => {
    cargarProductos();
    cargarVentas();
  }, []);

  const estaVencido = (producto) => {
    if (!producto.fechaVencimiento) return false;

    const fecha = new Date(producto.fechaVencimiento);

    const fechaLocal = new Date(
      fecha.getTime() + fecha.getTimezoneOffset() * 60000
    );

    const vencimiento = [
      fechaLocal.getFullYear(),
      String(fechaLocal.getMonth() + 1).padStart(2, "0"),
      String(fechaLocal.getDate()).padStart(2, "0")
    ].join("-");

    const hoy = new Date().toLocaleDateString("en-CA");

    return vencimiento <= hoy;
  };

  const formatoFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleDateString("es-PE", {
      timeZone: "UTC"
    });
  };

  const guardarProducto = async (formulario, editando) => {
    const precio = Number(formulario.precio);
    const stock = Number(formulario.stock);
    const stockMinimo = Number(formulario.stockMinimo);

    if (
      !formulario.nombre.trim() ||
      formulario.precio === "" ||
      formulario.stock === "" ||
      !Number.isFinite(precio) ||
      precio < 0 ||
      !Number.isInteger(stock) ||
      stock < 0 ||
      !Number.isInteger(stockMinimo) ||
      stockMinimo < 0
    ) {
      mostrarMensaje("Completa correctamente los datos", true);
      return false;
    }

    const datos = {
      nombre: formulario.nombre.trim(),
      descripcion: formulario.descripcion,
      precio,
      stock,
      stockMinimo,
      fechaVencimiento: formulario.fechaVencimiento || null
    };

    try {
      const url = editando
        ? `${API}/productos/${editando}`
        : `${API}/productos`;

      const respuesta = await fetch(url, {
        method: editando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.mensaje || "Error al guardar medicamento"
        );
      }

      mostrarMensaje(
        editando
          ? "Medicamento actualizado correctamente"
          : "Medicamento registrado correctamente"
      );

      await cargarProductos();
      return true;
    } catch (err) {
      mostrarMensaje(err.message, true);
      return false;
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Deseas eliminar este medicamento?")) {
      return;
    }

    try {
      const respuesta = await fetch(`${API}/productos/${id}`, {
        method: "DELETE"
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.mensaje || "Error al eliminar medicamento"
        );
      }

      mostrarMensaje("Medicamento eliminado correctamente");
      await cargarProductos();
    } catch (err) {
      mostrarMensaje(err.message, true);
    }
  };

  const registrarVenta = async (medicamentoId, cantidad) => {
    try {
      const respuesta = await fetch(`${API}/ventas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          medicamentoId,
          cantidad
        })
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          resultado.mensaje || "No se pudo registrar la venta"
        );
      }

      mostrarMensaje("Venta registrada correctamente");

      await cargarProductos();
      await cargarVentas();

      return true;
    } catch (err) {
      mostrarMensaje(err.message, true);
      return false;
    }
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Menu />

        {mensaje && (
          <div
            role="status"
            className={error ? "mensaje error" : "mensaje exito"}
          >
            {mensaje}

            <button
              type="button"
              onClick={() => setMensaje("")}
            >
              ×
            </button>
          </div>
        )}

        <main className="contenedor">
          <Routes>
            <Route path="/" element={<Inicio />} />

            <Route
              path="/medicamentos"
              element={
                <Medicamentos
                  productos={productos}
                  guardarProducto={guardarProducto}
                  eliminarProducto={eliminarProducto}
                  estaVencido={estaVencido}
                  formatoFecha={formatoFecha}
                />
              }
            />

            <Route
              path="/ventas"
              element={
                <Ventas
                  productos={productos}
                  registrarVenta={registrarVenta}
                  estaVencido={estaVencido}
                />
              }
            />

            <Route
              path="/historial"
              element={<Historial ventas={ventas} />}
            />

            <Route path="*" element={<Inicio />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
