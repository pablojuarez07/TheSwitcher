import { useEffect, useState } from "react";

/*** VIEWS  ***/
import Homepage from "../Homepage/Homepage.jsx";
import GameList from "../GameList/GameList.jsx";
import GameForm from "../GameForm/GameForm.jsx";
import WaitingRoom from "../WaitingRoom/WaitingRoom.jsx";
import Match from "../Match/Match.jsx";
import Page404 from "../Page404/Page404.jsx";

/*** SERVICES ***/
import { SocketContext, useWebSocket } from "../../services/websocket.js";

/*** STYLES ***/
import "./App.css";

function App() {
  // States
  const [screen, setScreen] = useState("homepage");
  const [user, setUser] = useState({ name: "", id: 0 });
  const [webSoc, setWebSoc] = useState(null);
  const [listeners, setListeners] = useState([]);
  const [matchId, setMatchId] = useState(null);
  const [players, setPlayers] = useState([]);


  // Render the screen according to the state
  const screenRender = () => {
    switch (screen) {
      case "homepage":
        return <Homepage setUser={setUser} setScreen={setScreen} />;
      case "game-list":
        return <GameList user={user} setMatchId={setMatchId} setScreen={setScreen} />;
      case "form-game":
        return <GameForm user={user} setScreen={setScreen} setMatchid={setMatchId} players={players} setPlayers={setPlayers}/>;
      case "waiting-room":
        return <WaitingRoom matchId={matchId} user_id={user.id} setScreen={setScreen} isHost={false} players={players} setPlayers={setPlayers} />;
        case "match":
        return <Match setScreen={setScreen} matchId={matchId}  user_id={user.id}/>;
      default:
        return <Page404 />;
    }
  };

  return (
    <SocketContext.Provider value={[webSoc, setWebSoc, listeners, setListeners]}>
      <div className="App">{screenRender()}</div>
    </SocketContext.Provider>
  );
}

export default App;
