
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WaitingRoom from './WaitingRoom';
import { vi } from 'vitest';
import api from '../../services/api';
import { useWebSocket } from '../../services/websocket';
import '@testing-library/jest-dom';

// Mockear el WebSocket y el API
vi.mock('../../services/websocket');
vi.mock('../../services/api');

describe('WaitingRoom Component', () => {
  const mockSetPlayers = vi.fn();
  const mockSetScreen = vi.fn();
  const mockMatchId = 'test-match-id';
  const mockUserId = 'test-user-id';
  
  const players = [
    { username: 'Player1' },
    { username: 'Player2' },
  ];

  beforeEach(() => {
    // Resetear mocks antes de cada test
    vi.clearAllMocks();

    // Mock del API para fetchPlayers
    api.fetchData.mockResolvedValue({
      players,
      match_name: 'Test Match',
      has_begun: false,
    });

    // Mockear el WebSocket
    useWebSocket.mockReturnValue({
      connect: vi.fn(),
      on: vi.fn(),
      send: vi.fn(),

      off: vi.fn(),
    });
  });

  it('should render the WaitingRoom component with players', async () => {
    render(
      <WaitingRoom
        matchId={mockMatchId}
        user_id={mockUserId}
        setScreen={mockSetScreen}
        isHost={false}
        players={players}
        setPlayers={mockSetPlayers}
      />
    );

    // Verificar que se llamaron las funciones del WebSocket
    expect(useWebSocket().on).toHaveBeenCalledWith('player-joined-game', expect.any(Function));
    expect(useWebSocket().on).toHaveBeenCalledWith('player-left-game', expect.any(Function));

    // Esperar a que el nombre de la partida aparezca en la pantalla
    await waitFor(() => {
      expect(screen.getByText('Test Match')).toBeInTheDocument();
    });

    // Verificar que los jugadores se renderizan correctamente
    players.forEach(player => {
      expect(screen.getByText(player.username)).toBeInTheDocument();
    });
  });

  it('should start the game when the host clicks "Start Game"', async () => {
    render(
      <WaitingRoom
        matchId={mockMatchId}
        user_id={mockUserId}
        setScreen={mockSetScreen}
        isHost={true}
        players={players}
        setPlayers={mockSetPlayers}
      />
    );

    // Mock para la función de iniciar partida
    api.putData.mockResolvedValueOnce({});

    const startButton = screen.getByText('Start Game');
    fireEvent.click(startButton);

    // Verificar que la función API fue llamada correctamente
    expect(api.putData).toHaveBeenCalledWith(`matches/${mockMatchId}/start`, {});

    // Verificar que se cambia la pantalla a 'match'
    await waitFor(() => {
      expect(mockSetScreen).toHaveBeenCalledWith('match');
    });
  });

  it('should allow a player to leave the game', async () => {
    render(
      <WaitingRoom
        matchId={mockMatchId}
        user_id={mockUserId}
        setScreen={mockSetScreen}
        isHost={false}
        players={players}
        setPlayers={mockSetPlayers}
      />
    );

    // Mock para la función de abandonar partida
    api.putData.mockResolvedValueOnce({});

    const leaveButton = screen.getByText('Leave Game');
    fireEvent.click(leaveButton);

    // Verificar que la función API fue llamada correctamente
    expect(api.putData).toHaveBeenCalledWith(`players/${mockUserId}/UnassignMatch`, {});

    // Verificar que se cambia la pantalla a 'game-list'
    await waitFor(() => {
      expect(mockSetScreen).toHaveBeenCalledWith('game-list');
    });
  });
});

