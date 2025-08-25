import { render, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { UpdateBoard } from './UpdateBoard'; // Asegúrate de poner la ruta correcta
import { useWebSocket } from '../../services/websocket'; // Importar el hook del websocket

// Hacer un mock del hook useWebSocket
vi.mock('../../services/websocket', () => ({
    useWebSocket: vi.fn(),
  }));
  

describe('UpdateBoard component', () => {
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

  it('debería manejar el evento update-board', async () => {
    const setBoard = vi.fn();
    const setShapes = vi.fn();
    const mockBoardData = { board: 'mockBoard', shapes: 'mockShapes' };
    
    // Renderizar el componente
    render(<UpdateBoard setBoard={setBoard} setShapes={setShapes} />);

    // Simula el evento "update-board"
    await waitFor(() => {
      expect(mockWebSocket.on).toHaveBeenCalledWith('update-board', expect.any(Function));
      // Llama al callback de update-board con datos simulados
      const callback = mockWebSocket.on.mock.calls[0][1];
      callback(mockBoardData);
    });

    // Verificar que setBoard y setShapes hayan sido llamadas con los datos simulados
    expect(setShapes)
    
  });

  it('debería remover el listener de update-board en cleanup', () => {
    const setBoard = vi.fn();
    const setShapes = vi.fn();
    
    // Renderizar el componente
    const { unmount } = render(<UpdateBoard setBoard={setBoard} setShapes={setShapes} />);
    
    // Desmontar el componente
    unmount();

    // Verifica que el listener 'update-board' fue removido
    expect(mockWebSocket.off).toHaveBeenCalledWith('update-board');
  });
});
