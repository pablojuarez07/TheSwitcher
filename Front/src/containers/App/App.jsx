import { useEffect, useState } from "react";
import {Routes, Route} from 'react-router-dom';

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
  const [user, setUser] = useState({ name: "", id: 0 });
  const [webSoc, setWebSoc] = useState(null);
  const [listeners, setListeners] = useState([]);
  const [matchId, setMatchId] = useState(null);
  const [players, setPlayers] = useState([]);

  return (
    <SocketContext.Provider value={[webSoc, setWebSoc, listeners, setListeners]}>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage setUser={setUser} />} />
          <Route path="/games" element={<GameList user={user} setMatchId={setMatchId}/>} />
          <Route path="/form-game" element={<GameForm user={user} />} />
          <Route path="/waiting/:matchId" element={<WaitingRoom user_id={user.id} players={players} setPlayers={setPlayers} />}/>
          <Route path="/match/:matchId" element={<Match user_id={user.id} />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </div>
    </SocketContext.Provider>
  );
}

export default App;
