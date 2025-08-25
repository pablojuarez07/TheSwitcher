
import { useState, useEffect } from 'react'
import './GameList.css';
import { useWebSocket, } from "../../services/websocket";
import api from "../../services/api";
import lockIcon from "../../assets/img/lock_icon.svg";
import Modal from 'react-modal';

function GameList({ user, setMatchId, setScreen }) {
  const [games, setGames] = useState([]);  //lista de partidas
  const [error, setError] = useState(null); // Estado para manejar errores
  const [createGame, setCreateGame] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const ws = useWebSocket();

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
    setScreen("form-game");
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

  /*
  if (createGame) {
    console.log(user)
    return <AppLobby user={user}/>
  } */

  return (
    <>
      <div className="game-list-container">
        <div className="cells-list-container">
          <div className="cell-list red"></div>
          <div className="cell-list red"></div>
          <div className="cell-list green"></div>
          <div className="cell-list yellow"></div>
          <div className="cell-list teal"></div>
          <div className="cell-list yellow"></div>
          <div className="cell-list red"></div>
          <div className="cell-list teal"></div>
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
          <button onClick={() => { setIsOpen(false); }}
            style={{marginLeft: "10px", backgroundColor: "#5cb85c", color: "#fff"}} >Enviar</button>
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
                setScreen={setScreen}
                isPrivate={game.isPrivate}
                modalIsOpen={modalIsOpen}
                setIsOpen={setIsOpen}
                password={password}
                setPassword={setPassword}
              />
            ))
          ) : (
            <p className="style_p">No hay partidas disponibles</p>
          )}
        </div>

        <div className="cells-list-container">
          <div className="cell-list green"></div>
          <div className="cell-list teal"></div>
          <div className="cell-list yellow"></div>
          <div className="cell-list teal"></div>
          <div className="cell-list teal"></div>
          <div className="cell-list red"></div>
          <div className="cell-list red"></div>
          <div className="cell-list yellow"></div>
        </div>
      </div>

    </>
  )
}


function Game_Button({ name, connected_players, max_players, game_id, user_id, setMatchId, setScreen, isPrivate, modalIsOpen, setIsOpen, password, setPassword }) {
  const [showPriv, setShowPriv] = useState("");


  const handleJoinGame = async () => {
    try {
      if (isPrivate) {
        setIsOpen(true);
        //const passInput = prompt(`Inserte la contraseña de la partida ${name}:`);
        //setPassword(passInput);
      }

      // Crear el payload solo con player_id y game_id
      const updatePayload = {
        game_id: game_id, // Usa el ID de la partida
        player_id: user_id, // Asegúrate de tener el ID del jugador
        "password": password,
      };

      // Hacer el PUT para unirse a la partida
      const response = await api.putData(`players/${user_id}/AssignToMatch/${game_id}`, updatePayload);

      // La respuesta será un objeto vacío si fue un 204
      console.log(`Partida ${game_id} actualizada, usuario ${user_id} unido`);

      setMatchId(game_id);
      setScreen("waiting-room");

    } catch (error) {
      console.error(`Error al unirse a la partida ${game_id}:`, error);
    }
  };

  useEffect(() => {
    if (isPrivate) {
      setShowPriv(<img src={lockIcon} style={{ height: "25px" }}></img>)
    }
  }, []);

  return (
    <button className="game_button" onClick={handleJoinGame}>
      {showPriv} {name} - {connected_players}/{max_players} players {showPriv}
    </button>
  );
}

export default GameList;



