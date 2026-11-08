
import { Link } from "react-router-dom";

function Inicio() {
  return (
    <div className="pagina-inicio">
      <h1>Bienvenido a Botica Nova Salud 💛</h1>

      <p>
        Selecciona la opción que deseas realizar.
      </p>

      <div className="opciones-inicio">
        <Link to="/ventas" className="opcion">
          <h2>🛒 Realizar venta</h2>
          <p>Atender a un cliente y registrar su compra.</p>
        </Link>

        <Link to="/medicamentos" className="opcion">
          <h2>💊 Medicamentos</h2>
          <p>Consultar y administrar el inventario.</p>
        </Link>

        <Link to="/historial" className="opcion">
          <h2>📋 Historial de ventas</h2>
          <p>Consultar las ventas realizadas.</p>
        </Link>
      </div>
    </div>
  );
}

export default Inicio;
