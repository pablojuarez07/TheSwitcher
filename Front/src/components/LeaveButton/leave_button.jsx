import api from "../../services/api";
import exitIcon from '../../assets/img/exit_icon.svg';

export function LeaveButton({ player_id, setScreen }) {  
  const handleClick = async () => {
    try {
      const response = await api.putData(`players/${player_id}/UnassignMatch`, {});
      console.log(response);
      setScreen("game-list");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button style={{backgroundColor: "#c8343a", color: "#F3D4D5", fontSize: "1.1rem",
                    right: "1vw", top: "1.5vh", position: "fixed"}} onClick={handleClick}>
      <img style={{height: "1rem", marginRight: "7px"}} src={exitIcon} />
      Leave</button>
  );
}
