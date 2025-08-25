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

  test('should call onGameCreated with the game name when button is clicked', () => {
    const onGameCreatedMock = vi.fn();
    render(<CreateGameForm onGameCreated={onGameCreatedMock} />);

    const input = screen.getByPlaceholderText('Nombre de la partida');
    const button = screen.getByRole('button', { name: /crear partida/i });

    // Simulamos la entrada del usuario
    fireEvent.change(input, { target: { value: 'Mi Nueva Partida' } });
    
    // Simulamos el clic en el botón
    fireEvent.click(button);

    // Verificamos que la función fue llamada con el valor correcto
    expect(onGameCreatedMock).toHaveBeenCalledWith('Mi Nueva Partida');
  });
});
