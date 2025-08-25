import React, { useState, useEffect } from "react";
import api from "../../services/api";
import cancelIcon from "../../assets/img/cancel_icon.svg";

export function CancelButton({
  player_id,
  movCounter,
  setMovCounter,
  setRestoredMov,
}) {
  const [render, setRender] = useState(null);

  const handleClick = async () => {
    try {
      const response = await api.putData(
        `players/${player_id}/move_cards/cancel`,
        {}
      );
      console.log(response);
      setMovCounter(movCounter - 1);
      setRestoredMov(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (movCounter === 0) {
      setRender(
        <button
          style={{
            left: "2vw",
            top: "20px",
            backgroundColor: "#7e7e7e",
            color: "#e3e3e3",
            fontSize: "1.1rem",
            position: "absolute",
          }}
        >
          <img
            style={{ height: "1rem", marginRight: "7px" }}
            src={cancelIcon}
            alt="Cancel Icon"
          />
          Cancel Switch
        </button>
      );
    } else {
      setRender(
        <button
          style={{
            left: "2vw",
            top: "20px",
            backgroundColor: "#c8343a",
            color: "#F3D4D5",
            fontSize: "1.1rem",
            position: "absolute",
          }}
          onClick={handleClick}
        >
          <img
            style={{ height: "1rem", marginRight: "7px" }}
            src={cancelIcon}
            alt="Cancel Icon"
          />
          Cancel Switch
        </button>
      );
    }
  }, [movCounter]);

  return render;
}
