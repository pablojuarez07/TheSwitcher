import { useState, useEffect } from "react";
import "./Match.css";

/*** COMPONENTS  ***/
import MovDock from "../../components/MovDock/MovDock";
import Board from "../../components/Board/Board";
import FigDock from "../../components/FigDock/FigDock";
import { LeaveButton } from "../../components/LeaveButton/leave_button";
import { CancelButton } from "../../components/CancelButton/CancelButton.jsx";
import { PassBotton } from "../../components/PassButton/pass_botton";
import NextTurnAlert from "../../components/NextTurn/NextTurnAlert";
import WinGame from "../../components/WinGame/WinGame.jsx";
import Clock  from "../../components/Timer/Clock";
import ForbiddenColor from "../../components/ForbiddenColor/ForbiddenColor";
import Chat from "../../components/Chat/Chat";
import {DownFig} from "../../components/FigDock/DownFig";
import {UpFig} from "../../components/FigDock/UpFig";

/*** SERVICES ***/
import { useWebSocket } from "../../services/websocket";
import api from "../../services/api";
import { useWindowSize } from "@react-hook/window-size";

function Match({ setScreen, matchId, user_id}) {
  const ws = useWebSocket();

  const [movimientos, setMovimientos] = useState([]); // tipo
  const [movsId, setMovsId] = useState([]);           // id
  const [movsType, setMovsType] = useState([]);
  const [movSelect, setMovSelect] = useState(null);           // id
  const [movTypeSelect, setMovTypeSelect] = useState(null);   //tipo
  const [usedMov, setUsedMov] = useState([]);
  const [movCounter, setMovCounter] = useState(0);
  const [restoredMov, setRestoredMov] = useState(false);
  
  const [prohibitedColor, setProhibitedColor] = useState(null);

  const [tablero, setTablero] = useState([ [], [], [], [], [], []]);

  const [docks, setDocks] = useState(null);

  let data, data2, data3;

  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [players, setPlayers] = useState([null, null, null, null]);
  const pi_style = [{},{ margin: "0 1vh", rotate: "-90deg" },{ rotate: "180deg" },{margin: "0 1vh", rotate: "90deg"}]
  
  const figsStyles = [{ translate: "15vh -74vh", transform: "rotate(0deg)" }, { translate: "60vh -28vh", transform: "rotate(90deg)" }, { translate: "10vh 23vh", transform: "rotate(180deg)" }, { translate: "-37vh -28vh", transform: "rotate(270deg)" }];
  const [figuras, setFiguras] = useState({});
  const [figTypeSelect, setFigTypeSelect] = useState(null);
  const [figSelect, setFigSelect] = useState(null);
  const [figsId, setFigsId] = useState([]);
  const [figsType, setFigsType] = useState([]);
  const [isYour, setIsYour] = useState(false);

  const [playerBlock, setPlayerBlock] = useState([]);
  const [idShapeBlock, setIdShapeBlock] = useState([]);

  // recargar datos start
  const [reload, setReload] = useState(true);

  // cargar datos de inicio
  const startMatch = async () => {
    try {

      data = await api.fetchData(`matches/${matchId}/start`);
      data2 = await api.fetchData(`players/${user_id}/move_cards`); // para los id de las cartas mov
      data3 = await api.fetchData(`matches/${matchId}`);

      console.log("data: ", data);
      if (data.board) {
        setTablero(data.board); // Actualiza la referencia
        console.log("Tablero actualizado:", tablero);
      }
      
      if (data.figure_cards) {
        setFiguras(data.figure_cards);

        setFigsId([data.figure_cards[user_id][0]? data.figure_cards[user_id][0].id : 1,
                   data.figure_cards[user_id][1]? data.figure_cards[user_id][1].id : 1,
                   data.figure_cards[user_id][2]? data.figure_cards[user_id][2].id : 1,] );

        setFigsType([data.figure_cards[user_id][0]? data.figure_cards[user_id][0].type : 1,
                    data.figure_cards[user_id][1]? data.figure_cards[user_id][0].type : 1,
                    data.figure_cards[user_id][2]? data.figure_cards[user_id][0].type : 1 ] );
      }

      if(currentPlayer === null ){
        setCurrentPlayer(data.turns[0]);
        console.log("currentPlayer:", currentPlayer);
      }

      setMovimientos([
        {id: data2[0].move_card_id, type: data2[0].move_card_type }, 
        {id: data2[1].move_card_id, type: data2[1].move_card_type }, 
        {id: data2[2].move_card_id, type: data2[2].move_card_type }] );

      if (data2) { 
        setMovsId([ data2[0].move_card_id, 
                    data2[1].move_card_id, 
                    data2[2].move_card_id]);

        setMovsType([ data2[0].move_card_type, 
                      data2[1].move_card_type, 
                      data2[2].move_card_type]);
      }

      if (data3) setPlayers(data3.players);
      console.log("players:", players);

      setReload(false);
      console.log("reload");

    } catch (error) {
      console.error("Error fetching start data:", error);
    }
  };

  // setea las cartas 
  const seterFigs = (wsData) => {

    if(wsData){
      let newFigs = figuras[currentPlayer].filter(card => card.id !== wsData.shape_card_id);
      figuras[currentPlayer] = newFigs;
      setFiguras(figuras);
    }

    setDocks(
      <>
        {Object.keys(figuras).map((key, index) => {
          let your = key === user_id.toString();
          const playerfigsId = figuras[key].map((card) => card.id);
          const playerfigsType = figuras[key].map((card) => card.type);
          
          idShapeBlock.forEach((idShape) => {
            const indexBlock = playerfigsId.findIndex((id) => id === idShape);
            if (indexBlock !== -1) {
              playerfigsType[indexBlock] = 26;
              // Cambiar el tipo en figuras
              figuras[key][indexBlock].type = 26;
            }
          });
        
          return (
            <FigDock
              player={players ? players[index] : { username: "CPU", player_id: 0 }}
              className="fig-container"
              cardsArray={figuras[key]}
              stl={figsStyles[index]}
              key={`figDock${index}`}

              playerNum={index}
              uiStyle={pi_style[index]}
              turn={currentPlayer === players[index].player_id}
              currentPlayer={currentPlayer}

              yourFig={your} // Pasa isYour como prop
              setIsYour={setIsYour}
              figsId={playerfigsId}
              figsType={playerfigsType}
              setFigSelect={setFigSelect}
              figTypeSelect={figTypeSelect}
              setFigTypeSelect={setFigTypeSelect}
              setMovSelect={setMovSelect}
              setMovTypeSelect={setMovTypeSelect}
            />
          );
        })}
        <MovDock
          className="mov-container"
          cardsArray={movimientos}
          setMovSelect={setMovSelect}
          movSelect={movSelect}
          movsId={movsId}
          movsType={movsType}
          setMovTypeSelect={setMovTypeSelect}
          movTypeSelect={movTypeSelect}
        />
      </>
    );
  }

  useEffect(() => {
    if(reload){
      startMatch();
    }
  }, [reload]);


  useEffect(() => {
    if (restoredMov && usedMov.length > 0) {
      let newMovs = [...movimientos];
      const card = usedMov.pop();
      let index = newMovs.findIndex((mov) => mov.type === 8 && mov.id === card.id); // Encuentra el índice donde `type` es 8
      if (index !== -1) {
        newMovs[index] = card; // Restaura la carta en ese índice
      }
      setUsedMov([...usedMov]);
      setMovimientos(newMovs);
      setRestoredMov(false);
      console.log("movimientos actualizados:", movimientos);
      console.log("movimientos usados:", usedMov);
    }
  }, [restoredMov]);

  useEffect(() => {
    setTimeout(() => {
      // dar vuelta carta mov
      if (usedMov.length > 0) {
        let newMovs = [...movimientos];
        usedMov.forEach((card) => {
          console.log("recorriendo cartas:", card);
          let index = newMovs.findIndex((mov) => mov.id === card.id);
          if(index != -1) {
            newMovs[index] = {id: card.id, type: 8};
          }
        });
        setMovimientos(newMovs);
        console.log("movimientos actualizados:", movimientos);
        console.log("movimientos usados:", usedMov);
      }
    }, [50]);
    // seteamos cartas para mostrar en pantalla al inicio
    seterFigs();

    // escuchamos websocket para descartar cartas de figuras usadas
    ws.on('shape-card-used', (wsData) => {
      console.log("shape used:", wsData);
      seterFigs(wsData);
      setUsedMov([]);   //reset para no cancelar movs
      setMovCounter(0);
      console.log("color pro:", wsData.prohibited_color)
      setProhibitedColor(wsData.prohibited_color);
    });
    
    console.log("is your:", isYour);
    console.log("mov select id: ", movSelect);
    console.log("mov select type: ", movTypeSelect);
    console.log("fig select id: ", figSelect);
    console.log("fig select type: ", figTypeSelect);
    console.log("prohibited color:", prohibitedColor);

    return () => {
      ws.off('shape-card-used');
    }

  }, [figuras, movSelect, movTypeSelect, movsId, movsType, usedMov, figTypeSelect, figSelect, currentPlayer, tablero]);


  return (
    <>
      <div className="general-container">
       
         <DownFig setPlayerBlock={setPlayerBlock} setIdShapeBlock={setIdShapeBlock} setProhibitedColor={setProhibitedColor}/>
         <UpFig setPlayerBlock={setPlayerBlock} setIdShapeBlock={setIdShapeBlock}
               playerBlock={playerBlock} idShapeBlock={idShapeBlock} 
               figuras={figuras} setFiguras={setFiguras} setFigSelect={setFigSelect} 
               setFigTypeSelect={setFigTypeSelect} />
        
        <NextTurnAlert setCurrentPlayer={setCurrentPlayer} setReload={setReload} 
                       setUsedMov={setUsedMov} setMovCounter={setMovCounter} />


        <div className="match-container">
          <CancelButton player_id={user_id} movCounter={movCounter}
                        setMovCounter={setMovCounter} setRestoredMov={setRestoredMov}/>

          <ForbiddenColor color={prohibitedColor} />

          <WinGame setScreen={setScreen} />
          <div className="tablero">

            <Board board={tablero} setBoard={setTablero} matchId={matchId}
                                   movSelect={movSelect} movTypeSelect={movTypeSelect}
                                   figSelect={figSelect} figTypeSelect={figTypeSelect}
                                   setFigSelect={setFigSelect} setFigTypeSelect={setFigTypeSelect}
                                   figuras={figuras} setFiguras={setFiguras} 
                                   setMovSelect={setMovSelect}
                                   user_id={user_id} currentPlayer={currentPlayer}
                                   setUsedMov={setUsedMov} movCounter={movCounter}
                                   setMovCounter={setMovCounter} movimientos={movimientos}
                                   setProhibitedColor={setProhibitedColor}
                                   isYour={isYour} />
          </div>
          <div className="cards-container">
            {docks}
          </div>
        </div>

        <div className="chat-container">
          <Clock currentPlayer={currentPlayer} />
          
          <div
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                zIndex: 2,
              }}
            >
              <LeaveButton player_id={user_id} setScreen={setScreen} />
              <Chat player_id={user_id}/>

          </div>
          <div>
            {currentPlayer === user_id ? (
              <PassBotton match_id={matchId} setMovCounter={setMovCounter} setUsedMov={setUsedMov} 
                          setReload={setReload} />
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default Match; 
