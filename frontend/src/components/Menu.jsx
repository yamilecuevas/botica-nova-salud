
import { NavLink } from "react-router-dom";

function Menu() {
  return (
    <header className="barra-superior">
      <div className="marca">
        <span className="marca-icono">✚</span>

        <div>
          <h2>Botica Nova Salud</h2>
          <p>Tu salud, nuestra prioridad</p>
        </div>
      </div>

      <nav className="menu-navegacion">
        <NavLink to="/" end>
          Inicio
        </NavLink>

        <NavLink to="/medicamentos">
          Medicamentos
        </NavLink>

        <NavLink to="/ventas">
          Vender
        </NavLink>

        <NavLink to="/historial">
          Historial
        </NavLink>
      </nav>
    </header>
  );
}

export default Menu;

