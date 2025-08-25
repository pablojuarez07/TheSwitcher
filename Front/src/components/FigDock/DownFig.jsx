import { useEffect, useState } from "react";
import { useWebSocket } from "../../services/websocket";

export const DownFig = ({ setPlayerBlock, setIdShapeBlock, setProhibitedColor }) => {
    const ws = useWebSocket();
  
    useEffect(() => {
      ws.on("shape-card-block", (data) => {
        // Agregar los nuevos datos al arreglo existente
        setIdShapeBlock((prev) => [...prev, data.shape_card_id]);
        setPlayerBlock((prev) => [...prev, data.player_block_id]);
        setProhibitedColor(data.prohibited_color);
        console.log("shape-card-block:", data);
      });
  
      return () => {
        ws.off("shape-card-block");
      };
    }, []);
  
    return null;
  };
  

