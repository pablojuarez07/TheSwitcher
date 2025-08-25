import { useState, useEffect } from "react";
import api from "../../services/api";

export default function UseFig({ currentPlayer, colorCardsRef, 
                                user_id, shapes, setUsedMov,
                                figSelect, figTypeSelect, figuras,
                                setFigTypeSelect, setFigSelect, 
                                setFiguras, setMovCounter, setProhibitedColor, isYour }) {


  const selectShape = async (i, j, color) => { 
      console.log("currentPlayer:", currentPlayer);

      if (currentPlayer === user_id) {
        console.log("figSelect use:", figSelect);
        console.log("figTypeSelect use:", figTypeSelect);

        if (figSelect !== null) {
          console.log("figuras:", figuras);
          
          let sel = colorCardsRef.current[i][j];
          try {
            for (let key in shapes) {
              console.log("key:", key);
              if (shapes[key].shape === figTypeSelect) {
                console.log("shape:", shapes[key].shape);
                if (sel.classList.contains("board-highlighted")){ 
                    console.log("entrando al api");
                    try {

                      if (isYour) {
                        await api.putData(`players/use_shape_card/${figSelect}`, {
                          color: `${color}`,
                          location: `[${i},${j}]`,
                        });
  
                        const newFiguras = figuras[user_id].filter(card => card.id !== figSelect);
  
                        figuras[user_id] = newFiguras;
  
                        setFiguras(figuras);
                        setFigSelect(null);
                        setFigTypeSelect(null);
                        setUsedMov([]);   //reset para no cancelar movs
                        setMovCounter(0);
                      } else {
                        console.log("vamos a bloquear la carta");
                        await api.putData(`players/block_shape_card/${figSelect}`, {
                          color: `${color}`,
                          location: `[${i},${j}]`,
                        });

                        setFigSelect(null);
                        setFigTypeSelect(null);
                        setUsedMov([]);   //reset para no cancelar movs
                        setMovCounter(0);
                      }

                    } catch (error) {
                      console.error("Error al enviar los datos:", error);
                      return;
                    }

                    const newFiguras = figuras[user_id].filter(card => card.id !== figSelect);

                    figuras[user_id] = newFiguras;
                    
                    setFiguras(figuras);
                    setFigSelect(null);
                    setFigTypeSelect(null);
                    setUsedMov([]);   //reset para no cancelar movs
                    setMovCounter(0);
                  
                }
              }
            }
          } catch (error) {console.log("error: ", error);} 
        } else {
          console.log("selecciona una carta figura");
        }
      } else {
        console.log("no es tu turno!");
      }
  };

  return { selectShape };
}
