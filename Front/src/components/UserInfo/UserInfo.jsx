import { useState, useEffect } from "react";
import "./UserInfo.css";

export const UserInfo = ({ player, isTurn, uiStyle }) => {
    const [activeStyle, setActiveStyle] = useState("userInfo_player-face-inactive");

    useEffect(() => {

        setActiveStyle(isTurn ? "userInfo_player-face-active" : "userInfo_player-face-inactive");
    }, [isTurn]);

    return (
        <div className="userInfo_player-card" key={`${player.username}-${player.player_id}`} style={uiStyle} >
            <img className={activeStyle} src={`https://unavatar.io/${player.username}`}  alt="Player Avatar" />              
            <span className="userInfo_player-name">{player.username}</span>
        </div>
    );
};
