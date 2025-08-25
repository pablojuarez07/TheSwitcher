import { useState } from "react";
import api from "../../services/api";

function UseMov(currentPlayer, user_id, 
                movSelect, setMovSelect, movTypeSelect, 
                colorCardsRef, movPosible, 
                setMovPosible, switchAnimation,
                setUsedMov, movCounter, setMovCounter) {

  const [selCard, setSelCard] = useState([null, null]);
  const [cardPosition, setCardPosition] = useState([[], []]);

  // Función que desmarca todas las celdas del tablero
  const resetSelection = () => {

    colorCardsRef.current.forEach((row) => {
      row.forEach((card) => {
        if (card) {
          // Quitar todas las clases relacionadas con la selección o marcado
          card.classList.remove("markable", "board-selected");
          card.innerText = ""; // Limpia la "X" o cualquier otro texto
        }
      });
    });
    setSelCard([null, null]); // Reiniciar la selección de celdas
  };

  const selectCard = async (i, j) => {
    console.log("movSlect board: ", movSelect);
    if(currentPlayer === user_id){
      if (movSelect != null){
        let card = colorCardsRef.current[i][j];
         
        if (selCard[0] === null) {
          card.classList.toggle("board-selected");
          selCard[0] = card;
          setSelCard(selCard);
          cardPosition[0] = [i, j]; 
          setCardPosition(cardPosition);

          const res = await api.putData(`move_cards/preview`, {
            move_type: movTypeSelect, 
            position: `[${i},${j}]`,
          });

          console.log("posibles mov: ", res);
          if(res) {
            setMovPosible(res);
            markCells(res.up, res.down, res.left, res.right);
          }
          
        } else if (selCard[1] === null) {

          if (card.classList.contains("markable")) {
            card.classList.toggle("board-selected");
            selCard[1] = card;
            cardPosition[1] = [i, j];
            setSelCard(selCard);
            setCardPosition(cardPosition);

            let orientation = getSelectedDirection(i, j, movPosible);
            console.log(orientation);
            console.log("swith: ", cardPosition[0], cardPosition[1]);

            let res = await api.putData(`players/${user_id}/move_cards/${movSelect}/use`, {
              "orientation": `${orientation}`,
              "position": `[${cardPosition[0]}]`,
            });

            unmarkCells(movPosible.up, movPosible.down, movPosible.left, movPosible.right);
            setMovCounter(movCounter +1);

            
            setUsedMov((prevUsedMov) => [
              ...prevUsedMov, 
              {id: movSelect, type: movTypeSelect}
            ]);
            
            switchAnimation(selCard[0], selCard[1]);

            selCard[0].classList.remove("board-selected");
            selCard[1].classList.remove("board-selected");
            let aux = selCard[0].classList[1];
            selCard[0].classList.remove(selCard[0].classList[1]);
            selCard[0].classList.add(selCard[1].classList[1]);
            selCard[1].classList.remove(selCard[1].classList[1]);
            selCard[1].classList.add(aux);
            console.log(aux);
            selCard[0] = null;
            selCard[1] = null;

            if (movSelect != null){
              setMovSelect(null);
            }

          } else {
            // Si la celda no tiene "X", no se permite el intercambio
            console.log("No se puede seleccionar una celda que no esté marcada con 'X'");
            setSelCard([null, null]);
            setMovSelect(null);
          }
        }
      } else { 
        console.log("Selecciona una carta de movimiento!");
      }
    } else { 
      console.log("no es tu turno!");
    }

  };
  

  // Función para marcar con "X"
  const markCells = (up, down, left, right) => {
    if (up && colorCardsRef.current[up[0]] && colorCardsRef.current[up[0]][up[1]]) {
      let cellUp = colorCardsRef.current[up[0]][up[1]];
      cellUp.innerText = "X";
      cellUp.classList.add("markable"); // Añadir una clase para indicar que es seleccionable
    }
    if (down && colorCardsRef.current[down[0]] && colorCardsRef.current[down[0]][down[1]]) {
      let cellDown = colorCardsRef.current[down[0]][down[1]];
      cellDown.innerText = "X";
      cellDown.classList.add("markable");
    }
    if (left && colorCardsRef.current[left[0]] && colorCardsRef.current[left[0]][left[1]]) {
      let cellLeft = colorCardsRef.current[left[0]][left[1]];
      cellLeft.innerText = "X";
      cellLeft.classList.add("markable");
    }
    if (right && colorCardsRef.current[right[0]] && colorCardsRef.current[right[0]][right[1]]) {
      let cellRight = colorCardsRef.current[right[0]][right[1]];
      cellRight.innerText = "X";
      cellRight.classList.add("markable");
    }
  };


  // Función para desmarcar las "X"
  const unmarkCells = (up, down, left, right) => {
    if (up && colorCardsRef.current[up[0]] && colorCardsRef.current[up[0]][up[1]]) {
      let cellUp = colorCardsRef.current[up[0]][up[1]];
      cellUp.innerText = "";
      cellUp.classList.remove("markable");
    }
    if (down && colorCardsRef.current[down[0]] && colorCardsRef.current[down[0]][down[1]]) {
      let cellDown = colorCardsRef.current[down[0]][down[1]];
      cellDown.innerText = "";
      cellDown.classList.remove("markable");
    }
    if (left && colorCardsRef.current[left[0]] && colorCardsRef.current[left[1]][left[0]]) {
      let cellLeft = colorCardsRef.current[left[0]][left[1]];
      cellLeft.innerText = "";
      cellLeft.classList.remove("markable");
    }
    if (right && colorCardsRef.current[right[0]] && colorCardsRef.current[right[0]][right[1]]) {
      let cellRight = colorCardsRef.current[right[0]][right[1]];
      cellRight.innerText = "";
      cellRight.classList.remove("markable");
    }
  };

  // Función para obtener la dirección seleccionada
  const getSelectedDirection = (i, j, movPosible) => {
    if (movPosible.up && movPosible.up[0] === i && movPosible.up[1] === j) {
      return "up";
    } else if (movPosible.down && movPosible.down[0] === i && movPosible.down[1] === j) {
      return "down";
    } else if (movPosible.left && movPosible.left[0] === i && movPosible.left[1] === j) {
      return "left";
    } else if (movPosible.right && movPosible.right[0] === i && movPosible.right[1] === j) {
      return "right";
    }
    return "invalid";
  };


  return { selectCard, markCells, unmarkCells, resetSelection };

}

export default UseMov;