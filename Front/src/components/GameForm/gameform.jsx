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
        <div className="cell-create yellow"></div>
        <div className="cell-create red"></div>
        <div className="cell-create yellow"></div>
        <div className="cell-create yellow"></div>
        <div className="cell-create green"></div>
        <div className="cell-create red"></div>
      </div>
    </div>
    </>
  );
}


export default CreateGameForm;
