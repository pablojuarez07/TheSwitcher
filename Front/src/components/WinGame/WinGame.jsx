import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWebSocket } from "../../services/websocket";
import { useNavigate } from "react-router-dom";
import "./WinGame.css"

const WinGame = () => {
    const ws = useWebSocket();
    const [showWin, setShowWin] = useState(false);
    const [winner, setWinner] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        ws.on("game-won", (data) => {

            setWinner(data);

            setShowWin(true);
        });

        return () => {
            ws.off("game-won");
        };
    }, []);

    return (
        <>
            {showWin && (
                <>
                    <div className="win-game-message">
                        <h2 style={{color: "blue"}}>{winner} wins! </h2>
                        <button onClick={() => navigate("/games")}>Return to Lobby</button>
                    </div>
                    <Confetti width={window.innerWidth} height={window.innerHeight} />
                </>
            )}
        </>
    );
}

export default WinGame;
