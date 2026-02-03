import { useNavigate } from "react-router-dom";
import CreateGameForm from "../../components/GameForm/gameform";
import api from "../../services/api";

function GameForm({ user }) {
  const navigate = useNavigate();

  const handleCreateGame = async (gameName, password) => {
    try {
      const body =
        password === ""
          ? {
              match_name: gameName,
              max_players: 4,
              host: user.id,
            }
          : {
              match_name: gameName,
              max_players: 4,
              host: user.id,
              password: password,
            };

      const response = await api.postData("matches", body);

      console.log("Game created:", response);

      navigate(`/waiting/${response.match_id}`);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="lobby">
      <CreateGameForm onGameCreated={handleCreateGame} />
    </div>
  );
}

export default GameForm;
