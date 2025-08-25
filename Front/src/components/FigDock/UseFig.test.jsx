import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import UseFig from './UseFig';
import api from '../../services/api';  // Mockear la API

vi.mock('../../services/api', () => ({
  default: {
    putData: vi.fn(),
  },
}));

describe('UseFig', () => {
  let colorCardsRef;
  let setFiguras;
  let setFigSelect;
  let setFigTypeSelect;
  let setUsedMov;
  let setMovCounter;
  
  const currentPlayer = 1;
  const user_id = 1;
  const figSelect = 2;
  const figTypeSelect = 1;
  const figuras = {
    1: [
      { id: 2, shape: 1 },
    ],
  };
  const isYour = true;

  beforeEach(() => {
    colorCardsRef = { current: [[{ classList: { contains: vi.fn(() => false) } }]] };  // Mock de celdas
    setFiguras = vi.fn();
    setFigSelect = vi.fn();
    setFigTypeSelect = vi.fn();
    setUsedMov = vi.fn();
    setMovCounter = vi.fn();
    vi.clearAllMocks();
  });

  test('should make API call when a valid shape card is selected', async () => {
    // Mock del comportamiento de la celda seleccionada
    colorCardsRef.current[0][0].classList.contains = vi.fn(() => true); // La celda está resaltada

    // Simula el API
    api.putData.mockResolvedValueOnce({});

    // Renderiza el hook y ejecuta la función
    const { selectShape } = UseFig({
      currentPlayer,
      colorCardsRef,
      user_id,
      shapes: [{ shape: 1 }],
      setUsedMov,
      figSelect,
      figTypeSelect,
      figuras,
      setFiguras,
      setFigSelect,
      setFigTypeSelect,
      setMovCounter,
      isYour,
    });

    await act(async () => {
      await selectShape(0, 0, 'r');  // Simula la selección de una celda con un color
    });

    // Verifica que la API haya sido llamada con los parámetros correctos
    expect(api.putData).toHaveBeenCalledWith('players/use_shape_card/2', {
      color: 'r',
      location: '[0,0]',
    });

    // Verifica que los estados hayan sido actualizados correctamente
    expect(setFiguras).toHaveBeenCalled();
    expect(setFigSelect).toHaveBeenCalledWith(null);
    expect(setFigTypeSelect).toHaveBeenCalledWith(null);
    expect(setUsedMov).toHaveBeenCalledWith([]);
    expect(setMovCounter).toHaveBeenCalledWith(0);
  });

  test('should not select a shape if it is not highlighted', async () => {
    colorCardsRef.current[0][0].classList.contains = vi.fn(() => false);  // La celda no está resaltada

    const { selectShape } = UseFig({
      currentPlayer,
      colorCardsRef,
      user_id,
      shapes: [{ shape: 1 }],
      setUsedMov,
      figSelect,
      figTypeSelect,
      figuras,
      setFiguras,
      setFigSelect,
      setFigTypeSelect,
      setMovCounter,
    });

    await act(async () => {
      await selectShape(0, 0, 'b');
    });

    // Verifica que la API no haya sido llamada porque la celda no está resaltada
    expect(api.putData).not.toHaveBeenCalled();

    // Verifica que el estado no haya cambiado
    expect(setFiguras).not.toHaveBeenCalled();
    expect(setFigSelect).not.toHaveBeenCalled();
    expect(setFigTypeSelect).not.toHaveBeenCalled();
    expect(setUsedMov).not.toHaveBeenCalled();
    expect(setMovCounter).not.toHaveBeenCalled();
  });

  test('should not make the move if it is not the current player\'s turn', async () => {
    const currentPlayer = 2;  // No es el turno del jugador

    const { selectShape } = UseFig({
      currentPlayer,
      colorCardsRef,
      user_id,
      shapes: [{ shape: 1 }],
      setUsedMov,
      figSelect,
      figTypeSelect,
      figuras,
      setFiguras,
      setFigSelect,
      setFigTypeSelect,
      setMovCounter,
    });

    await act(async () => {
      await selectShape(0, 0, 'g');
    });

    // Verifica que la API no haya sido llamada porque no es el turno del jugador
    expect(api.putData).not.toHaveBeenCalled();
  });

});
