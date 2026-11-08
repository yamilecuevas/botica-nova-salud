
import { useState } from "react";

function Historial({ ventas }) {
  const [busqueda, setBusqueda] = useState("");

  const ventasFiltradas = ventas.filter((venta) =>
    (venta.medicamento || venta.nombreProducto || "")
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const formatoDinero = (valor) =>
    `S/ ${Number(valor || 0).toFixed(2)}`;

  return (
    <div className="pagina">
      <h1>📋 Historial de ventas</h1>

      <p>
        Consulta las ventas realizadas en Botica Nova Salud.
      </p>

      <section className="tarjeta">
        <h2>Ventas registradas</h2>

        <input
          type="search"
          placeholder="🔎 Buscar medicamento vendido..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Total</th>
                <th>Fecha</th>
              </tr>
            </thead>

            <tbody>
              {ventasFiltradas.map((venta) => (
                <tr key={venta._id}>
                  <td>
                    {venta.medicamento ||
                      venta.nombreProducto ||
                      "Medicamento"}
                  </td>

                  <td>{venta.cantidad}</td>

                  <td>
                    {formatoDinero(venta.precioUnitario)}
                  </td>

                  <td>
                    <strong>
                      {formatoDinero(venta.total)}
                    </strong>
                  </td>

                  <td>
                    {venta.fecha
                      ? new Date(venta.fecha).toLocaleString("es-PE")
                      : "Sin fecha"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {ventasFiltradas.length === 0 && (
          <p>No se encontraron ventas registradas.</p>
        )}
      </section>
    </div>
  );
}

export default Historial;

