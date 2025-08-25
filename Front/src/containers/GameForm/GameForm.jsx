import { useState, useEffect } from "react";
import CreateGameForm from "../../components/GameForm/gameform";
import WaitingRoom from "../WaitingRoom/WaitingRoom";
import api from "../../services/api";

function GameForm({ user, setScreen, setMatchid, players, setPlayers }) {
  const [isInGame, setIsInGame] = useState(false);
  const [gameName, setGameName] = useState("");
  const [body, setBody] = useState({});
  const [match_id, setMatch_id] = useState(0);

  const PostMatch = async (body) => {
    try {
      const response = await api.postData("matches", body);
      console.log(response);
      setMatchid(response.match_id);
      setMatch_id(response.match_id);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateGame = (gameName, password) => {
    const newBody =
      (password == "") ? {
        match_name: gameName,
        max_players: 4,
        host: user.id
      } : {
        match_name: gameName,
        max_players: 4,
        host: user.id,
        "password": password
      };
    setBody(newBody);
    PostMatch(newBody);
    setGameName(gameName);
    setTimeout(() => {
      setIsInGame(true);
    }, 1000);

    console.log("Game created", gameName, password);

  };


  return (
    <div className="lobby">
      {!isInGame ? (
        <CreateGameForm onGameCreated={handleCreateGame} />
      ) : (

        <WaitingRoom matchId={match_id} user_id={user.id} setScreen={setScreen} isHost={true} players={players} setPlayers={setPlayers} />
      )}
    </div>
  );


}


export default GameForm;