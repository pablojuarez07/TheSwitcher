
import { useState, useEffect } from 'react'
import './GameList.css';
import { useWebSocket, } from "../../services/websocket";
import api from "../../services/api";
import lockIcon from "../../assets/img/lock_icon.svg";
import Modal from 'react-modal';
import { useNavigate } from "react-router-dom";

function GameList({ user, setMatchId }) {
  const [games, setGames] = useState([]);  //lista de partidas
  const [error, setError] = useState(null); // Estado para manejar errores
  const [modalIsOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);
  const ws = useWebSocket();
  const navigate = useNavigate();

  const fetchGames = async (dataws) => {
    try {
      const response = await api.fetchData('matches/');
      const data = response.matches; // Extraer la lista de partidas
      console.log("KKK", data);
      const filteredGames = data.filter(game =>
        game.player_count < game.max_players && !game.has_begun // Filtrar partidas no llenas y no comenzadas
      );
      setGames(filteredGames);
    } catch (error) {
      setGames([]); // Si ocurre un error, mostramos que no hay partidas
      console.error("Error al obtener las partidas:", error);
    }
  };

  useEffect(() => {

    fetchGames();

    ws.on('create-game', fetchGames);
    ws.on("player-joined-game", fetchGames);
    ws.on("player-left-game", fetchGames);
    ws.on("start-game-lobby", fetchGames);

    return () => {
      ws.off('create-game');
      ws.off("player-joined-game");
      ws.off("player-left-game");
      ws.off("start-game-lobby");
    };

  }, []);

  const handleCreateGame = () => {
    navigate("/form-game");
  }

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: "#492617ff",
    },
  };

  Modal.defaultStyles.overlay.backgroundColor = "#00000088";

  const handlePrivateJoin = async () => {
    try {

      const updatePayload = {
        game_id: selectedGame.game_id,
        player_id: selectedGame.user_id,
        password: password,
      };

      await api.putData(
        `players/${selectedGame.user_id}/AssignToMatch/${selectedGame.game_id}`,
        updatePayload
      );

      setMatchId(selectedGame.game_id);

      setIsOpen(false);

      navigate(`/waiting/${selectedGame.game_id}`);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="game-list-container">
        <div className="cells-list-container">
          <div className="cell-list red wave-1"></div>
          <div className="cell-list red wave-2"></div>
          <div className="cell-list green wave-3"></div>
          <div className="cell-list yellow wave-4"></div>
          <div className="cell-list teal wave-5"></div>
          <div className="cell-list yellow wave-6"></div>
          <div className="cell-list red wave-7"></div>
          <div className="cell-list teal wave-8"></div>
        </div>

        <h2 className="style_h1">Partidas</h2>
        <button className="create-game-button" onClick={handleCreateGame}>Crear partida</button>
        {/* Mostramos lista de partidas */}
        <Modal
          style={modalStyles}
          isOpen={modalIsOpen}
          contentLabel="Minimal Modal Example"
        >
          <input
            className="game-input-password"
            type="text"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => { handlePrivateJoin(); }}
            style={{marginLeft: "10px", backgroundColor: "#5cb85c", color: "#fff"}} >
              Enviar
          </button>
        </Modal>

        <div className="game-list">
          {(games && games.length) > 0 ? (
            games.map((game, index) => (
              <Game_Button
                key={index}
                name={game.match_name}
                connected_players={game.player_count}
                max_players={game.max_players}
                game_id={game.id}
                user_id={user.id}
                setMatchId={setMatchId}
                isPrivate={game.isPrivate}
                modalIsOpen={modalIsOpen}
                setIsOpen={setIsOpen}
                password={password}
                setPassword={setPassword}
                setSelectedGame={setSelectedGame}
              />
            ))
          ) : (
            <p className="style_p">No hay partidas disponibles</p>
          )}
        </div>

        <div className="cells-list-container">
          <div className="cell-list green wave-1"></div>
          <div className="cell-list teal wave-2"></div>
          <div className="cell-list yellow wave-3"></div>
          <div className="cell-list teal wave-4"></div>
          <div className="cell-list teal wave-5"></div>
          <div className="cell-list red wave-6"></div>
          <div className="cell-list red wave-7"></div>
          <div className="cell-list yellow wave-8"></div>
        </div>
      </div>

    </>
  )
}


function Game_Button({ 
  name, connected_players, max_players, game_id, user_id, 
  setMatchId, isPrivate, modalIsOpen, setIsOpen, password, setPassword,
  setSelectedGame
 }) {
  const [showPriv, setShowPriv] = useState("");
  const navigate = useNavigate();

  const handleJoinGame = async () => {

    if (isPrivate) {
      setSelectedGame({
        game_id,
        user_id
      });

      setIsOpen(true);
      return;
    }

    try {
      const updatePayload = {
        game_id,
        player_id: user_id,
        password: "",
      };

      await api.putData(
        `players/${user_id}/AssignToMatch/${game_id}`,
        updatePayload
      );

      setMatchId(game_id);
      navigate(`/waiting/${game_id}`);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isPrivate) {
      setShowPriv(<img src={lockIcon} style={{ height: "25px" }}></img>)
    }
  }, []);

  return (
    <button className="game_button" onClick={handleJoinGame}>

      <div className="game_left">
        {isPrivate && (
          <img src={lockIcon} className="lock-icon" />
        )}

        <span className="game_name">
          {name}
        </span>
      </div>

      <div className="game_right">
        {connected_players}/{max_players}
      </div>

    </button>
  );
}

export default GameList;



