import { useEffect, useState } from "react";
import { useWebSocket } from "../../services/websocket";
import "./NextTurnAlert.css"; // Archivo CSS para los estilos

const NextTurnAlert = ({setCurrentPlayer, setReload, setMovCounter, setUsedMov}) => {
  const ws = useWebSocket();
  const [nextPlayer, setNextPlayer] = useState(null); // Estado para manejar la alerta
  const [showAlert, setShowAlert] = useState(false);  // Controla cuándo mostrar la alerta
  
  useEffect(() => {
    // Escuchar el evento "next-turn"
    ws.on("next-turn", (data) => {
      setNextPlayer(data.next_player_name); // Actualizar el jugador que sigue
      setShowAlert(true); // Mostrar la alerta
      setCurrentPlayer(data.next_player_id);
      // resetea las cartas usadas
      //setMovCounter(0);
      //setUsedMov([]);

      console.log("reload enter");
      setReload(true);
    
      // Ocultar la alerta después de 5 segundos
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    });

    return () => {
      ws.off("next-turn");
    };
  }, []);

  return (
    <div className={`next-turn-alert ${showAlert ? 'show' : ''}`}>
      {nextPlayer && (
        <div className="alert">
          <h3>{nextPlayer}</h3>
          <p>
            {nextPlayer.name}
            It's your turn!</p>
        </div>
      )}
    </div>
  );
};

export default NextTurnAlert; 
