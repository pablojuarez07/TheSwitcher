import { useState } from "react";
import "./gameform.css";

function CreateGameForm({ onGameCreated }) {
  const [gameName, setGameName] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateGame = () => {
    onGameCreated(gameName, password);
  };

  return (
    <>
    <div className="match_form_container">
      <div className="form-card">
        <h1 className="style_create">Crear partida</h1>
        <input
          className="game-input"
          type="text"
          placeholder="Nombre de la partida"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
        />
        <input
          className="game-input-password"
          type="text"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="create_match_button" onClick={handleCreateGame}>Crear partida</button>

        <div className="cells-create-container">
          <div className="cell-create yellow wave-1"></div>
          <div className="cell-create red wave-2"></div>
          <div className="cell-create yellow wave-3"></div>
          <div className="cell-create yellow wave-4"></div>
          <div className="cell-create green wave-5"></div>
          <div className="cell-create red wave-6"></div>
        </div>
      </div>
    </div>
    </>
  );
}


export default CreateGameForm;
