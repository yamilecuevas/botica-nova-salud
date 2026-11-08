
import { useState } from "react";

function Ventas({ productos, registrarVenta, estaVencido }) {
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [vendiendo, setVendiendo] = useState(false);

  // Medicamentos que se pueden vender
  const disponibles = productos.filter(
    (producto) =>
      Number(producto.stock) > 0 &&
      !estaVencido(producto)
  );

  // Medicamento seleccionado
  const seleccionado = disponibles.find(
    (producto) => String(producto._id) === String(productoId)
  );

  // Calcular cantidad y total
  const unidades = Number(cantidad);

  const total =
    seleccionado &&
    cantidad !== "" &&
    Number.isInteger(unidades) &&
    unidades > 0
      ? Number(seleccionado.precio) * unidades
      : 0;

  const guardarVenta = async (e) => {
    e.preventDefault();

    if (vendiendo) return;

    if (
      !seleccionado ||
      !Number.isInteger(unidades) ||
      unidades <= 0 ||
      unidades > Number(seleccionado.stock)
    ) {
      alert("Verifica el medicamento y la cantidad disponible.");
      return;
    }

    setVendiendo(true);

    try {
      const guardado = await registrarVenta(
        seleccionado._id,
        unidades
      );

      if (guardado) {
        setProductoId("");
        setCantidad("");
      }
    } finally {
      setVendiendo(false);
    }
  };

  return (
    <div className="pagina">
      <h1>🛒 Realizar venta</h1>
      <p>Registra los medicamentos que compra el cliente.</p>

      <section className="tarjeta">
        <h2>Nueva venta</h2>

        <form onSubmit={guardarVenta} className="formulario">

          <label>Seleccionar medicamento</label>

          <select
            value={productoId}
            onChange={(e) => {
              setProductoId(e.target.value);
              setCantidad("");
            }}
            required
          >
            <option value="">Seleccione un medicamento</option>

            {disponibles.map((producto) => (
              <option
                key={producto._id}
                value={producto._id}
              >
                {producto.nombre} - S/{" "}
                {Number(producto.precio).toFixed(2)}
              </option>
            ))}
          </select>

          {seleccionado && (
            <p>
              Disponible:{" "}
              <strong>{seleccionado.stock} unidades</strong>
            </p>
          )}

          <label>Cantidad a vender</label>

          <input
            type="number"
            min="1"
            max={seleccionado ? seleccionado.stock : undefined}
            step="1"
            placeholder="Ingrese la cantidad"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            required
          />

          <div className="resumen-venta">
            <h3>Resumen de compra</h3>

            <p>
              Medicamento:{" "}
              <strong>
                {seleccionado
                  ? seleccionado.nombre
                  : "Sin seleccionar"}
              </strong>
            </p>

            <p>
              Precio unitario: S/{" "}
              {seleccionado
                ? Number(seleccionado.precio).toFixed(2)
                : "0.00"}
            </p>

            <p>
              Cantidad:{" "}
              {cantidad !== "" ? cantidad : "0"}
            </p>

            <h2>
              Total a pagar: S/ {total.toFixed(2)}
            </h2>
          </div>

          <button
            type="submit"
            disabled={vendiendo}
          >
            {vendiendo
              ? "Registrando..."
              : "Registrar venta"}
          </button>

        </form>
      </section>
    </div>
  );
}

export default Ventas;
