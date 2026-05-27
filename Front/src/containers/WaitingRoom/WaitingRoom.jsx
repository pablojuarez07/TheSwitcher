import { useState, useEffect } from 'react';
import './WaitingRoom.css';
import api from "../../services/api.js";
import { useWebSocket } from "../../services/websocket.js";
import { useNavigate, useParams } from "react-router-dom";

function WaitingRoom({ user_id, players, setPlayers }) {
    const [matchName, setMatchName] = useState(null);
    const [host, setHost] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const ws = useWebSocket();
    const navigate = useNavigate();
    const { matchId } = useParams();
    const [mouseY, setMouseY ] = useState(0);

    const fetchPlayers = async () => {

        try {
            const data = await api.fetchData(`matches/${matchId}`);
            setPlayers(data.players);
            setMatchName(data.match_name);
            setHost(data.host);
            setIsHost(data.host === user_id);
            if (data.has_begun) {
                navigate(`/match/${matchId}`);
            }
        } catch (error) {
            setPlayers([]);
            setMatchName('error');
        }
    };

    // Función para iniciar la partida (solo anfitrión)
    const handleStartGame = async () => {
        try {
            const payload = {}; // Puedes agregar un payload si es necesario
            await api.putData(`matches/${matchId}/start`, payload);
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

    const isActive = (squareY) => {
        return Math.abs(mouseY - squareY) < 80;
    };

    useEffect(() => {
        fetchPlayers();

        ws.on("player-joined-game", fetchPlayers);

        ws.on("player-left-game", (dataWs) => {
            console.log("HostWs: ", dataWs, "Host: ", host);
            if (dataWs.player_id === host) {
                // El host se ha ido, todos deben ser expulsados
                console.log("afitrión se ha ido, expulsando a todos los jugadores: ", dataWs);
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
    }, [players]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMouseY(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    const getOffset = (squareY) => {
        const distance = Math.abs(mouseY - squareY);

        // distancia máxima donde todavía hay efecto
        const maxDistance = 200;

        // si está muy lejos no se mueve
        if (distance > maxDistance) return 0;

        // valor entre 0 y 1
        const intensity = 1 - distance / maxDistance;

        // movimiento máximo
        return intensity * 45;
    };

    // Función para abandonar la partida
    const handleLeave = async () => {
        try {
            const payload = {};
            await api.putData(`players/${user_id}/UnassignMatch`, payload);
            navigate("/games");
        } catch (error) {
            console.error("Error al abandonar la partida:", error);
        }
    };

    return (
        <>
            <div className="waiting-room-container">
                <div className="left-column">
                    <div className='cell-room red' style={{ transform: `translateX(${-getOffset(100)}px)` }}></div>
                    <div className='cell-room green' style={{ transform: `translateX(${-getOffset(200)}px)` }}></div>
                    <div className='cell-room yellow' style={{ transform: `translateX(${-getOffset(300)}px)` }}></div>
                    <div className='cell-room teal' style={{ transform: `translateX(${-getOffset(400)}px)` }}></div>
                    <div className='cell-room red' style={{ transform: `translateX(${-getOffset(500)}px)` }}></div>
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
                    <div className='cell-room yellow' style={{ transform: `translateX(${getOffset(100)}px)` }}></div>
                    <div className='cell-room red' style={{ transform: `translateX(${getOffset(200)}px)` }}></div>
                    <div className='cell-room teal' style={{ transform: `translateX(${getOffset(300)}px)` }}></div>
                    <div className='cell-room green' style={{ transform: `translateX(${getOffset(400)}px)` }}></div>
                    <div className='cell-room yellow' style={{ transform: `translateX(${getOffset(500)}px)` }}></div>
                </div>
            </div>
        </>
    );
}

export default WaitingRoom;
