
import { render, screen, fireEvent } from '@testing-library/react';
import api from '../../services/api'; // Mockear la API
import { useWebSocket } from '../../services/websocket'; // Mockear el WebSocket
import GameList from './GameList';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('../../services/websocket', () => ({
  useWebSocket: () => ({
    connect: vi.fn(),
    on: vi.fn(),
    send: vi.fn(),
    off : vi.fn(),
  }),
}));

// Mockear el API
vi.mock('../../services/api', () => {
  return {
    default: { fetchData: vi.fn(), postData: vi.fn() },
    api: vi.fn(),
  };
});

describe('GameList Component', () => {

  const user = { username: "user", id: 1 }; // Crea un mock del usuario
  const setMatchId = vi.fn();
  const setScreen = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

   test('displays game list when games are available', async () => {
    api.fetchData.mockResolvedValueOnce({
      matches: [
        { id: 1, match_name: 'Game 1', player_count: 2, max_players: 4, has_begun: false },
        { id: 2, match_name: 'Game 2', player_count: 3, max_players: 4, has_begun: false },
      ],
    });

    render(<GameList user={user} setMatchId={setMatchId} setScreen={setScreen} />);

    expect(await screen.findByText('Partidas')).toBeInTheDocument();
    expect(await screen.findByText('Game 1 - 2/4 players')).toBeInTheDocument();
    expect(await screen.findByText('Game 2 - 3/4 players')).toBeInTheDocument();
  });

  test('displays message when no games are available', async () => {
    api.fetchData.mockResolvedValueOnce({ matches: [] }); // Simula que no hay partidas

    render(<GameList user={user} setMatchId={setMatchId} setScreen={setScreen} />);

    expect(await screen.findByText('No hay partidas disponibles')).toBeInTheDocument();
  });

});