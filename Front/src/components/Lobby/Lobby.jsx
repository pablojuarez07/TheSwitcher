import { useState, useEffect } from "react";
import "./Lobby.css";
import { useWebSocket } from "../../services/websocket";
import axios from "axios";



function Lobby({ matchid }) {
  const [players, setPlayers] = useState([]);
  	const [matchName, setMatchName] = useState(null);
    const ws = useWebSocket();
  	const colors = ['#f3d25cff', '#61b5a4ff', '#df5d4fff', '#a7b552ff'];

    const fetchPlayers = async (data) => {
        try {
          const data = await axios.get(`matches/${matchid}`);
          console.log("Datos de jugadores:", data); // Verifica la respuesta
          setPlayers(data.players);
          setMatchName(data.match_name);
          if(data.has_begun){
            setScreen('match');
          }
        } catch (error) {
          console.error("Error fetching players:", error);
          setPlayers([]);
          setMatchName('error');
        }
    };

  	useEffect(() => {

  		fetchPlayers();
      
  		ws.on("player-joined-game", fetchPlayers);
      ws.on("player-left-game", fetchPlayers);

      return () => {
        ws.off("player-joined-game");
        ws.off("player-left-game");
      }
  	  
  	}, []); 

  // Función para abandonar la partida
  

  return (
    <>
      <div className="waiting-room-container">
      <div className="left-column">
        <div className="cell-room left-cell red"></div>
        <div className="cell-room left-cell green"></div>
        <div className="cell-room left-cell yellow"></div>
        <div className="cell-room left-cell teal"></div>
        <div className="cell-room left-cell red"></div>
      </div>

      <div className="waiting-room">
        <h2 className="room_h2">{matchName}</h2>
        <div className="players-container">
           	{ players.map((player, index) => (

			    <div key={index} className="player-box">
			      <div className="player-circle" style={{ backgroundColor: colors[index % colors.length] }} ></div>
			      <span className="player-name">{player.username}</span>
			    </div>))

            }
        </div>
        <button className="leave-button" >Start Game</button>
      </div>

      <div className="right-column">
        <div className="cell-room right-cell yellow"></div>
        <div className="cell-room right-cell red"></div>
        <div className="cell-room right-cell teal"></div>
        <div className="cell-room right-cell green"></div>
        <div className="cell-room right-cell yellow"></div>
      </div>
      </div>
    </>
  );
}

export default Lobby;

