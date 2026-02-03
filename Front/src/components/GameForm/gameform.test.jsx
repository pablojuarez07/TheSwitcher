import { render, screen, fireEvent } from '@testing-library/react';
import CreateGameForm from './gameform'; 
import '@testing-library/jest-dom';

describe('CreateGameForm', () => {
  test('should render the input and button', () => {
    render(<CreateGameForm onGameCreated={vi.fn()} />);

    const input = screen.getByPlaceholderText('Nombre de la partida');
    const button = screen.getByRole('button', { name: /crear partida/i });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('should call onGameCreated with game name and password when button is clicked', () => {
    const onGameCreatedMock = vi.fn();
    render(<CreateGameForm onGameCreated={onGameCreatedMock} />);

    const nameInput = screen.getByPlaceholderText('Nombre de la partida');
    const passwordInput = screen.getByPlaceholderText('Contraseña');
    const button = screen.getByRole('button', { name: /crear partida/i });

    fireEvent.change(nameInput, { target: { value: 'Mi Nueva Partida' } });
    fireEvent.change(passwordInput, { target: { value: '1234' } });

    fireEvent.click(button);

    expect(onGameCreatedMock).toHaveBeenCalledWith('Mi Nueva Partida', '1234');
  });
});
