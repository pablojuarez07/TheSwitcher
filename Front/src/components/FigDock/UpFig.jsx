
import { useEffect, useState } from "react";
import { useWebSocket } from "../../services/websocket";

export const UpFig = ({ setPlayerBlock, setIdShapeBlock, playerBlock, idShapeBlock, 
                        figuras, setFiguras, setFigSelect, setFigTypeSelect}) => {

    const ws = useWebSocket();
    
    useEffect(() => {
        ws.on("shape-card-unblock", (data) => {
            setTimeout(() => {
                const newPlayerBlock = playerBlock.filter(playerId => playerId !== data.player_id);
                const newIdShapeBlock = idShapeBlock.filter(shapeId => shapeId !== data.unblocked_shape_card_id);

                console.log("new players:", newPlayerBlock);
                console.log("new shapesID;", newIdShapeBlock);

                setPlayerBlock(newPlayerBlock);
                setIdShapeBlock(newIdShapeBlock);
                
                // Crear una copia de figuras antes de actualizar
                const updatedFiguras = { ...figuras };

                // Actualizar el tipo de carta desbloqueada en la copia de figuras
                updatedFiguras[data.player_id] = updatedFiguras[data.player_id].map(shapeCard => 
                    shapeCard.id === data.unblocked_shape_card_id 
                        ? { ...shapeCard, type: data.unblocked_shape_card_type } 
                        : shapeCard
                );

                setFigSelect(null);
                setFigTypeSelect(null);

                // Establecer la nueva copia de figuras
                setFiguras(updatedFiguras);

                console.log("shape-card-unlock:", data);
            }, [50]); 
        });
    
        return () => {
            ws.off("shape-card-unblock");
        };
    }, [playerBlock, idShapeBlock, figuras]);

    return null;
};
