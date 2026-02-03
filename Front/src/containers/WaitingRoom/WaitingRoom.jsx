import { useState, useEffect } from 'react';
import './WaitingRoom.css';
import api from "../../services/api.js";
import { useWebSocket } from "../../services/websocket.js";
import { useNavigate, useParams } from "react-router-dom";

function WaitingRoom({ user_id, players, setPlayers }) {
    console.log(players, setPlayers);
    const [matchName, setMatchName] = useState(null);
    const [host, setHost] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const ws = useWebSocket();
    const navigate = useNavigate();
    const { matchId } = useParams();

    const fetchPlayers = async () => {

        try {
            const data = await api.fetchData(`matches/${matchId}`);
            console.log("Datos de jugadores:", data); // Verifica la respuesta
            setPlayers(data.players);
            setMatchName(data.match_name);
            setHost(data.host);
            setIsHost(data.host === user_id);
            if (data.has_begun) {
                navigate(`/match/${matchId}`);
            }
        } catch (error) {
            console.error("Error fetching players:", error);
            setPlayers([]);
            setMatchName('error');
        }
    };

    // Función para iniciar la partida (solo anfitrión)
    const handleStartGame = async () => {
        try {
            const payload = {}; // Puedes agregar un payload si es necesario
            await api.putData(`matches/${matchId}/start`, payload);
            console.log(`El anfitrión ${user_id} ha iniciado la partida ${matchId}`);
            navigate(`/match/${matchId}`);
        } catch (error) {
            console.error("Error al iniciar la partida:", error);
            alert("Wait a minute, there's no one here")
        }
    };

    const handleHostLeft = (player_id) => {
        // Notificar a todos los jugadores que el anfitrión se fue y cerrar la sala
        if(player_id !== user_id){
            alert("El anfitrión ha abandonado la partida.");
            navigate("/games");
        }
    };

    useEffect(() => {
        fetchPlayers();

        ws.on("player-joined-game", fetchPlayers);

        ws.on("player-left-game", (dataWs) => {

            if (dataWs.player_id === host) {
                // El host se ha ido, todos deben ser expulsados
                handleHostLeft(dataWs.player_id);
            } else {
                // Si no es el host, actualizar la lista de jugadores
                fetchPlayers();
            }
        });

        ws.on("start-game", fetchPlayers);

        return () => {
            ws.off("player-joined-game");
            ws.off("player-left-game");
            ws.off("start-game");
        };
    }, []);

    // Función para abandonar la partida
    const handleLeave = async () => {
        try {
            const payload = {};
            await api.putData(`players/${user_id}/UnassignMatch`, payload);
            console.log(`Jugador ${user_id} ha abandonado la partida ${matchId}`);
            navigate("/games");
        } catch (error) {
            console.error("Error al abandonar la partida:", error);
        }
    };

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
                        {players.map((player, index) => (
                            <div key={index} className="player-box">
                                    <img className="player-circle" src={`https://unavatar.io/${player.username}`} />
                                <span className="player-name">{player.username}</span>
                            </div>
                        ))}
                    </div>
                    <button className="leave-button" onClick={handleLeave}>Leave Game</button>

                    {isHost && (
                        <button className="start-button" onClick={handleStartGame}>
                            Start Game
                        </button>
                    )}
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

export default WaitingRoom;
