import { useEffect, useState, useRef } from "react";
import "./Board.css";
import anime from "animejs";

import UseMov from "../UseMov/UseMov.jsx";
import UseFig from "../FigDock/UseFig.jsx";
import { UpdateBoard } from "./UpdateBoard";

const Board = ({board, setBoard, matchId, 
                movSelect, setMovSelect, 
                figSelect, figTypeSelect, 
                setFigSelect, setFigTypeSelect, 
                movTypeSelect, user_id,  
                currentPlayer, setUsedMov,
                movCounter, setMovCounter,
                movimientos, figuras, setFiguras, 
                setProhibitedColor,
                isYour}) => {

  const [colorCards, setColorCards] = useState([]);
  const [movPosible, setMovPosible] = useState({});
  const colorCardsRef = useRef(Array.from({ length: 6 }, () => Array(6).fill(null)));
  const [shapes, setShapes] = useState({});
  const [ub, setUb] = useState(null);


  const switchAnimation = (card1, card2) => {
    let c1 = card1.getBoundingClientRect();
    let c2 = card2.getBoundingClientRect();

    let translateX = (9/6)*(c2.left - c1.left);
    let translateY = (9/6)*(c2.top - c1.top);

    anime({
      targets: card1,
      translateX: translateX,
      translateY: translateY,
      easing: 'easeInOutQuad',
      duration: 500,
      complete: () => {
        anime({
          targets: card1,
          translateX: 0,
          translateY: 0,
          duration: 0
        });
      }
    });

    anime({
      targets: card2,
      translateX: -translateX,
      translateY: -translateY,
      easing: 'easeInOutQuad',
      duration: 500,
      complete: () => {
        anime({
          targets: card2,
          translateX: 0,
          translateY: 0,
          duration: 0
        });
      }
    });
  };

  // Llamamos useMov  
  const { selectCard, markCells, unmarkCells, resetSelection } = UseMov(currentPlayer, user_id, 
                                                                movSelect, setMovSelect, movTypeSelect,
                                                                colorCardsRef, movPosible, 
                                                                setMovPosible, switchAnimation,
                                                                setUsedMov, movCounter, setMovCounter);

  // Llamamos useFig
  const { selectShape } = UseFig({ currentPlayer, colorCardsRef, user_id, shapes, 
                                   figSelect, figTypeSelect, figuras, setFiguras, 
                                   setFigTypeSelect, setFigSelect, setUsedMov, setMovCounter,
                                   setProhibitedColor, isYour });

  // para desmarcar si se elige otra carta
  useEffect(() => {
    resetSelection();
  }, [movSelect]);

  useEffect(() => {

    const colorSel = (letter) => {
      switch (letter) {
        case "r": return "red";
        case "g": return "green";
        case "y": return "yellow";
        case "b": return "teal";
        default:  return "brown";
      }
    };
    let cc = [];

    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        if (figSelect){
          cc.push(
            <div
              key={`cc-${i}-${j}`}
              ref={(el) => (colorCardsRef.current[i][j] = el)}

              onClick={()=>{/*selectCard(i, j); */selectShape(i,j, board[i][j]) }}

              className={`board-square ${colorSel(board[i][j])}`}
            > </div>
          );
        } else {
          cc.push(
            <div
              key={`cc-${i}-${j}`}
              ref={(el) => (colorCardsRef.current[i][j] = el)}

              onClick={()=>{ selectCard(i, j)/*; selectShape(i,j, board[i][j]) */}}

              className={`board-square ${colorSel(board[i][j])}`}
            > </div>
          );
        }
      }
    }
    setColorCards(cc);
    //console.log("newBoard",cc);
  }, [movSelect, currentPlayer, movPosible, board, movimientos, figSelect]);

  // Resaltar las posiciones y aplicar el borde basado en las figuras
  useEffect(() => {

    setTimeout(() => { 
      // Recorre todas las celdas y resalta solo si no están siendo seleccionadas
      colorCardsRef.current.forEach((row) =>
        row.forEach((card) => {
          if (card) {
            // Si la carta no tiene la clase "board-selected", la limpiamos
            if (!card.classList.contains("board-selected")) {
              card.classList.remove("board-highlighted");
              card.style.borderColor = ""; // Limpiar borde solo si no está seleccionada
            }
          }
        })
      );
    
      // Aplicar el resalte y color a las posiciones de las figuras
      Object.values(shapes).forEach((shape) => {
        const { color, positions } = shape;
    
        positions.forEach(([x, y]) => {
          const card = colorCardsRef.current[x][y];
          if (card) {
            // Resaltar y cambiar el borde solo si no está seleccionada
            if (!card.classList.contains("board-selected")) {
              card.style.borderColor = color; // Aplicar color al borde solo si no está seleccionada
              card.classList.add("board-highlighted"); // Añadir clase de resalte
            }
          }
        });
      });

    }, [100]);
  }, [shapes, board]);



  return (
    <div>
      <UpdateBoard setBoard={setBoard} setShapes={setShapes} matchId={matchId}
                    user_id={user_id} setMovSelect={setMovSelect} />
      <div className="board-content ">
        <div className="board-grid brown">{colorCards}</div>
      </div>
    </div>
  );
};

export default Board;
