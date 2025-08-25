
import { createContext, useContext, useEffect } from "react";

export const SocketContext = createContext([{}, () => {}, [], () => {}]);

export const useWebSocket = () => {
  const WS_URL = import.meta.env.VITE_WS_URL;
  const [webSoc, setWebSoc, listeners, setListeners] = useContext(SocketContext);

  // Uapdate websocket with listeners
  useEffect(() => {
    if (webSoc) {
      webSoc.onmessage = (evt) => {
        const message = evt.data;
        console.log("messge:", message);
        console.log(listeners);
        const { action, data } = JSON.parse(message);
        listeners.forEach((listener) => {
          if (listener.action === action) {
            listener.callback(data);
          }
        });
      };
    }
  }, [listeners, webSoc]);

  const connect = (id) => {
    const websocket = new WebSocket(`${WS_URL}/${id}`);

    websocket.onopen = () => {
      console.log("WebSocket is connected");
      websocket.send("Hello from frontend");
    };

    websocket.onmessage = (evt) => {
      const message = evt.data;
      console.log("message recived:", message);
    };

    websocket.onclose = () => {
      console.log("WebSocket is closed");
    };

    setWebSoc(websocket);
    console.log("WebSocket finish connected");
  };

  const send = (action, data) => {
    if (webSoc) {
      try {
        webSoc.send(
          JSON.stringify({
            action,
            data,
          })
        );
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const on = (action, callback) => {
    // Aquí usamos setListeners con una función que recibe el estado anterior
    setListeners((prevListeners) => [...prevListeners, { action, callback }]);
  };

  const off = (action) => {
    // Actualizar listeners eliminando aquellos que coincidan con la acción
    setListeners((prevListeners) =>
      prevListeners.filter((listener) => listener.action !== action)
    );
  };

  return { connect, send, on, off, listeners };
};
