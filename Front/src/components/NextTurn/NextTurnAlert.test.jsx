import { render, screen, act } from '@testing-library/react';
import { vi } from 'vitest';
import NextTurnAlert from './NextTurnAlert';
import { useWebSocket } from '../../services/websocket';
import '@testing-library/jest-dom';

// Mock del hook useWebSocket
vi.mock('../../services/websocket', () => ({
  useWebSocket: vi.fn(),
}));

describe('NextTurnAlert component', () => {
  let mockWebSocket;

  beforeEach(() => {
    // Crear un mock del WebSocket
    mockWebSocket = {
      on: vi.fn(),
      off: vi.fn(),
    };
    // Configurar el mock para devolver el WebSocket falso
    useWebSocket.mockReturnValue(mockWebSocket);
  });

  test('muestra la alerta cuando se recibe el evento next-turn', async () => {
    const mockSetCurrentPlayer = vi.fn();
    const mockSetReload = vi.fn();
    const mockSetMovCounter = vi.fn();
    const mockSetUsedMov = vi.fn();

    render(<NextTurnAlert setCurrentPlayer={mockSetCurrentPlayer} setReload={mockSetReload}
                          setMovCounter={mockSetMovCounter} setUsedMov={mockSetUsedMov} />);

    // Simular el evento "next-turn" llamando a la función de callback registrada en el mock
    const nextTurnEvent = mockWebSocket.on.mock.calls.find(
      ([eventName]) => eventName === 'next-turn'
    )[1];

    // Ejecutar el callback manualmente para simular la llegada del evento
    act(() => {
      nextTurnEvent({ next_player_name: 'Player 1', next_player_id: 1 });
    });

    // Verifica que la alerta aparece en pantalla
    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.getByText("It's your turn!")).toBeInTheDocument();
    expect(mockSetCurrentPlayer).toHaveBeenCalledWith(1);
    expect(mockSetReload).toHaveBeenCalledWith(true);
    
  });
});
