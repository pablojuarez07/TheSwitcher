import { useEffect, useCallback, useState } from "react";
import api from "../../services/api";
import { useWebSocket, } from "../../services/websocket";
import { useNavigate } from "react-router-dom";

function Homepage({ setUser }) {
  const [inputUsername, setInputUsername] = useState("");
  const ws = useWebSocket();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const sendUsername = useCallback(() => {
    setLoading(true);
    api.postData("players/", { "username": inputUsername })
    .then((data) => {
      console.log(data);
      setUser({ "name": data.username, "id": data.player_id });

      // Conectar al WebSocket
      ws.connect(data.player_id);
      ws.send("player-join", { "player_id": data.player_id });

      navigate("/games");
    }).catch ((error) => {
      console.error("Error creating player:", error);
      alert("Error al conectar con el servidor.")
      setLoading(false);
    }).finally(() => {
      setLoading(false);
    });
  }, [inputUsername, setUser]); 

  useEffect(() => {
    const inputElement = document.getElementById("inputUsername");
    const handleKeyDown = (e) => {
      if (e.key === "Enter") sendUsername();
    };
    return () => {
      inputElement.removeEventListener("keydown", handleKeyDown); 
    };
  }, [sendUsername]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendUsername();
  };

  return (
    <div className="container brown">
      <div className="grid">
        <div className="cell yellow float-slow wave-1"></div>
        <div className="cell teal float-medium wave-2"></div>
        <div className="cell red float-fast wave-3"></div>
        <div className="cell yellow float-slow wave-4"></div>
        <div className="cell red float-medium wave-5"></div>
        <div className="cell teal float-fast wave-6"></div>
        <div className="cell yellow float-slow wave-7"></div>
        <div className="cell green float-medium wave-8"></div>
        <div className="cell green float-fast wave-1"></div>
        <div className="cell yellow float-slow wave-2"></div>
        <div className="cell main-cell yellow wave-3">
          <h1>
            THE
            SWITCHER
            <br />
            GAME
          </h1>
          <div className="input-area">
            <form onSubmit={handleSubmit}>
              <input
                id="inputUsername"
                type="text"
                value={inputUsername} 
                onChange={(e) => setInputUsername(e.target.value)} 
                placeholder="Username"
                autoFocus
                disabled={loading}
              />
              <button type="submit" className="button-play" disabled={loading}>
                {loading ? <div className="spinner"></div> : "Play!"}
              </button>
            </form>
          </div>
        </div>
        <div className="cell red float-slow wave-7"></div>
        <div className="cell yellow float-medium wave-8"></div>
        <div className="cell red float-fast wave-1"></div>
        <div className="cell green float-slow wave-2"></div>
        <div className="cell yellow float-medium wave-7"></div>
        <div className="cell red float-fast wave-8"></div>
        <div className="cell teal float-slow wave-1"></div>
        <div className="cell green float-medium wave-2"></div>
        <div className="cell teal float-fast wave-3"></div>
        <div className="cell red float-slow wave-4"></div>
        <div className="cell green float-medium wave-5"></div>
        <div className="cell teal float-fast wave-6"></div>
        <div className="cell yellow float-slow wave-7"></div>
        <div className="cell green float-medium wave-8"></div>
      </div>
    </div>
  );
}

export default Homepage;