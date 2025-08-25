import { useEffect } from 'react';
import { useWebSocket } from '../../services/websocket';
import api from '../../services/api';




export const UpdateBoard = ({setBoard, setShapes, matchId, setMovSelect}) => {

    const ws = useWebSocket();


    // shapes iniciales
    const initialShapes = async () => {
        try {
            //console.log("entra a initialShapes")
            let data = await api.fetchData(`matches/${matchId}/start`);
            //console.log("data: ", data);
            if(data.shapes) setShapes(data.shapes);

        } catch (error) {
            console.error("Error fetching initial shapes:", error);
        }
    }

    useEffect(() => {
        //setShapes(shapes);
        setTimeout(() => {
            initialShapes();
        }, 500);

        //console.log("entrando a update-board")
        ws.on('update-board', (data) => {
            setTimeout(() => {
                console.log("websocket: ", data.board);
                setBoard((prevBoard) => {
                    //console.log("Tablero previo:", prevBoard);
                    //console.log("Nuevo tablero:", data.board);
                    return data.board;
                });
                setShapes(data.shapes);
                //setMovSelect(null);
                //(console.log(board);
            }, 100);
        });
        
        return () => {
            ws.off('update-board');
        };
    }, []);

    return null;
}