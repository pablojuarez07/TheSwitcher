import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Homepage from './Homepage';

import api from '../../services/api';
import { useWebSocket } from '../../services/websocket';

import '@testing-library/jest-dom';

// Mockear el servicio WebSocket
vi.mock('../../../services/websocket', () => ({
  useWebSocket: () => ({
    connect: vi.fn(),
    on: vi.fn(),
    send: vi.fn(),

    off: vi.fn(),

  }),
}));

// Mockear el API

vi.mock('../../services/api', () => {

  return {
    default: { fetchData: vi.fn(), postData: vi.fn() },
    api: vi.fn(),
  };
});

describe('Homepage', () => {
  const setUserMock = vi.fn();
  const setScreenMock = vi.fn();
  const mockData = { username: 'TestUser', player_id: 1 };

  beforeEach(() => {
    render(<Homepage setUser={setUserMock} setScreen={setScreenMock} />);
  });

  afterEach(() => {
    vi.clearAllMocks(); // Limpia los mocks después de cada prueba
  });

  it('renders input and button', () => {
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();

    expect(screen.getByText('Play!')).toBeInTheDocument();

  });

  it('updates input value', () => {
    const input = screen.getByPlaceholderText('Username');
    fireEvent.change(input, { target: { value: 'TestUser' } });
    expect(input.value).toBe('TestUser');
  });

  it('calls sendUsername on form submit', async () => {
    const input = screen.getByPlaceholderText('Username');
    fireEvent.change(input, { target: { value: 'TestUser' } });

    // Mockear la respuesta del API
    api.postData.mockResolvedValueOnce({
      username: 'TestUser',
      player_id: 1,
    });


    fireEvent.click(screen.getByText('Play!'));

    // Esperar a que las expectativas se resuelvan
    await waitFor(() => {
      expect(api.postData).toHaveBeenCalledWith('players/', { username: 'TestUser' });
      expect(setUserMock).toHaveBeenCalledWith({ id: 1, name: 'TestUser' });
      
    });
    


  });

  
});
