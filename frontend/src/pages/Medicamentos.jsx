
import { useState } from "react";

const formularioInicial = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  stockMinimo: 5,
  fechaVencimiento: ""
};

function Medicamentos({
  productos,
  guardarProducto,
  eliminarProducto,
  estaVencido,
  formatoFecha
}) {
  const [formulario, setFormulario] = useState(formularioInicial);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const cambiarCampo = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const guardar = async (e) => {
    e.preventDefault();

    const guardado = await guardarProducto(formulario, editando);

    if (guardado) {
      setFormulario(formularioInicial);
      setEditando(null);
    }
  };

  const editar = (producto) => {
    setEditando(producto._id);

    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: producto.precio,
      stock: producto.stock,
      stockMinimo: producto.stockMinimo ?? 5,
      fechaVencimiento: producto.fechaVencimiento
        ? producto.fechaVencimiento.substring(0, 10)
        : ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelar = () => {
    setEditando(null);
    setFormulario(formularioInicial);
  };

  const filtrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="pagina">
      <h1>💊 Medicamentos</h1>
      <p>Consulta y administra los medicamentos de la botica.</p>

      <section className="tarjeta">
        <h2>
          {editando ? "Editar medicamento" : "Agregar medicamento"}
        </h2>

        <form onSubmit={guardar} className="formulario">
          <input
            name="nombre"
            placeholder="Nombre del medicamento"
            value={formulario.nombre}
            onChange={cambiarCampo}
            required
          />

          <input
            name="descripcion"
            placeholder="Descripción"
            value={formulario.descripcion}
            onChange={cambiarCampo}
          />

          <label>Precio (S/)</label>
          <input
            name="precio"
            type="number"
            min="0"
            step="0.01"
            value={formulario.precio}
            onChange={cambiarCampo}
            required
          />

          <label>Cantidad en stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            value={formulario.stock}
            onChange={cambiarCampo}
            required
          />

          <label>Stock mínimo</label>
          <input
            name="stockMinimo"
            type="number"
            min="0"
            step="1"
            value={formulario.stockMinimo}
            onChange={cambiarCampo}
            required
          />

          <label>Fecha de vencimiento</label>
          <input
            name="fechaVencimiento"
            type="date"
            value={formulario.fechaVencimiento}
            onChange={cambiarCampo}
          />

          <button type="submit">
            {editando ? "Actualizar medicamento" : "Guardar medicamento"}
          </button>

          {editando && (
            <button type="button" onClick={cancelar}>
              Cancelar edición
            </button>
          )}
        </form>
      </section>

      <section className="tarjeta">
        <h2>Inventario de medicamentos</h2>

        <input
          type="search"
          placeholder="🔎 Buscar medicamento..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Vencimiento</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map((producto) => (
                <tr key={producto._id}>
                  <td>{producto.nombre}</td>
                  <td>S/ {Number(producto.precio).toFixed(2)}</td>
                  <td>{producto.stock}</td>
                  <td>{formatoFecha(producto.fechaVencimiento)}</td>

                  <td>
                    {estaVencido(producto)
                      ? "🚫 Vencido"
                      : producto.stock === 0
                      ? "❌ Agotado"
                      : producto.stock <= (producto.stockMinimo ?? 5)
                      ? "⚠️ Stock bajo"
                      : "✅ Disponible"}
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() => editar(producto)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => eliminarProducto(producto._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtrados.length === 0 && (
          <p>No se encontraron medicamentos.</p>
        )}
      </section>
    </div>
  );
}

export default Medicamentos;
