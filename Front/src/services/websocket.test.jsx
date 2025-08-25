import { renderHook, act } from "@testing-library/react";
import { SocketContext, useWebSocket } from "./websocket"; // Ajusta el path si es necesario
import { vi } from "vitest";

describe("useWebSocket hook", () => {
  let mockWebSocket;

  beforeEach(() => {
    mockWebSocket = {
      send: vi.fn(),
      onopen: vi.fn(),
      onmessage: vi.fn(),
      onclose: vi.fn(),
    };
    
    // Simulamos la WebSocket global
    global.WebSocket = vi.fn(() => mockWebSocket);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("debería enviar un mensaje cuando se llama a send()", () => {
    const setWebSoc = vi.fn();
    const setListeners = vi.fn();
    const wrapper = ({ children }) => (
      <SocketContext.Provider value={[mockWebSocket, setWebSoc, [], setListeners]}>
        {children}
      </SocketContext.Provider>
    );

    const { result } = renderHook(() => useWebSocket(), { wrapper });

    act(() => {
      result.current.send("test-action", { key: "value" });
    });

    expect(mockWebSocket.send).toHaveBeenCalledWith(
      JSON.stringify({
        action: "test-action",
        data: { key: "value" },
      })
    );
  });

  it("debería agregar un listener cuando se llama a on()", () => {
    const setListeners = vi.fn();
    const wrapper = ({ children }) => (
      <SocketContext.Provider value={[mockWebSocket, vi.fn(), [], setListeners]}>
        {children}
      </SocketContext.Provider>
    );

    const { result } = renderHook(() => useWebSocket(), { wrapper });

    act(() => {
      result.current.on("test-action", () => {});
    });

    expect(setListeners).toHaveBeenCalledWith(expect.any(Function));
  });

  it("debería eliminar un listener cuando se llama a off()", () => {
    const setListeners = vi.fn();
    const wrapper = ({ children }) => (
      <SocketContext.Provider value={[mockWebSocket, vi.fn(), [], setListeners]}>
        {children}
      </SocketContext.Provider>
    );

    const { result } = renderHook(() => useWebSocket(), { wrapper });

    act(() => {
      result.current.off("test-action");
    });

    expect(setListeners).toHaveBeenCalledWith(expect.any(Function));
  });

  it("debería manejar el caso en que no haya WebSocket al llamar a send()", () => {
    // Simula que WebSocket no está disponible
    global.WebSocket = undefined;

    const setWebSoc = vi.fn();
    const setListeners = vi.fn();
    const wrapper = ({ children }) => (
      <SocketContext.Provider value={[null, setWebSoc, [], setListeners]}>
        {children}
      </SocketContext.Provider>
    );

    const { result } = renderHook(() => useWebSocket(), { wrapper });

    // Esperamos que no ocurra un error cuando se llame a send
    act(() => {
      result.current.send("test-action", { key: "value" });
    });

    // Como no hay WebSocket, no debe haberse llamado al método send
    expect(mockWebSocket.send).not.toHaveBeenCalled();
  });
});
