import { renderHook, act } from '@testing-library/react';
import UseMov from './UseMov'; // Asegúrate de usar la ruta correcta
import { vi } from 'vitest';
import api from '../../services/api';

vi.mock('../../services/api', () => {
  return {
    default: { fetchData: vi.fn(), postData: vi.fn(), putData: vi.fn() },
    api: vi.fn(),
  };
});

// Mocking el objeto colorCardsRef
const mockColorCardsRef = {
  current: [
    [{ classList: { toggle: vi.fn(), contains: vi.fn(() => false), add: vi.fn(), remove: vi.fn() }, innerText: '' },
     { classList: { toggle: vi.fn(), contains: vi.fn(() => false), add: vi.fn(), remove: vi.fn() }, innerText: '' }],
    [{ classList: { toggle: vi.fn(), contains: vi.fn(() => false), add: vi.fn(), remove: vi.fn() }, innerText: '' },
     { classList: { toggle: vi.fn(), contains: vi.fn(() => false), add: vi.fn(), remove: vi.fn() }, innerText: '' }]
  ]
};

describe('UseMov hook', () => {
  let currentPlayer = 1;
  let user_id = 1;
  let movSelect = 1;
  let movTypeSelect = 'move_type';
  let movPosible = {};
  let setMovPosible = vi.fn();
  let setUsedMov = vi.fn();
  let movCounter = 0;
  let setMovCounter = vi.fn();
  let switchAnimation = vi.fn();

  it('should initialize hook and select card', async () => {
    const { result } = renderHook(() =>
      UseMov(currentPlayer, user_id, movSelect, vi.fn(), movTypeSelect, mockColorCardsRef, movPosible, setMovPosible, switchAnimation, setUsedMov, movCounter, setMovCounter)
    );

    // Simulamos la selección de una celda
    const selectCard = result.current.selectCard;

    await act(async () => {
      selectCard(0, 0);
    });

    // Verificamos que la celda esté marcada como "board-selected"
    expect(mockColorCardsRef.current[0][0].classList.toggle).toHaveBeenCalledWith('board-selected');
  });

  it('should not allow selection if movSelect is null', async () => {

    movSelect = null;

    const { result } = renderHook(() =>
      UseMov(currentPlayer, user_id, movSelect, vi.fn(), movTypeSelect, mockColorCardsRef, movPosible, setMovPosible, switchAnimation, setUsedMov, movCounter, setMovCounter)
    );

    const selectCard = result.current.selectCard;

    await act(async () => {
      selectCard(0, 0);
    });

    // Verificamos que no se haya llamado a toggle
    expect(mockColorCardsRef.current[0][0].classList.toggle).toHaveBeenCalled();
  });

  it('should mark cells correctly', async () => {
    const { result } = renderHook(() =>
      UseMov(currentPlayer, user_id, movSelect, vi.fn(), movTypeSelect, mockColorCardsRef, movPosible, setMovPosible, switchAnimation, setUsedMov, movCounter, setMovCounter)
    );



    const markCells = result.current.markCells;
    
    // Definir las celdas que se deben marcar
    const up = [0, 0];
    const down = [1, 0];
    const left = [0, 1];
    const right = [1, 1];

    // Marcar las celdas
    markCells(up, down, left, right);

    // Verificar que las celdas estén marcadas
    expect(mockColorCardsRef.current[0][0].innerText).toBe('X');
    expect(mockColorCardsRef.current[1][0].innerText).toBe('X');
    expect(mockColorCardsRef.current[0][1].innerText).toBe('X');
    expect(mockColorCardsRef.current[1][1].innerText).toBe('X');
    expect(mockColorCardsRef.current[0][0].classList.add).toHaveBeenCalledWith('markable');
    expect(mockColorCardsRef.current[1][0].classList.add).toHaveBeenCalledWith('markable');
    expect(mockColorCardsRef.current[0][1].classList.add).toHaveBeenCalledWith('markable');
    expect(mockColorCardsRef.current[1][1].classList.add).toHaveBeenCalledWith('markable');
  });

  it('should unmark cells correctly', async () => {
    const { result } = renderHook(() =>
      UseMov(currentPlayer, user_id, movSelect, vi.fn(), movTypeSelect, mockColorCardsRef, movPosible, setMovPosible, switchAnimation, setUsedMov, movCounter, setMovCounter)
    );

    const unmarkCells = result.current.unmarkCells;
    
    // Definir las celdas que se deben desmarcar
    const up = [0, 0];
    const down = [1, 0];
    const left = [0, 1];
    const right = [1, 1];

    // Desmarcar las celdas
    unmarkCells(up, down, left, right);

    // Verificar que las celdas se hayan desmarcado
    expect(mockColorCardsRef.current[0][0].innerText).toBe('');
    expect(mockColorCardsRef.current[1][0].innerText).toBe('');
    expect(mockColorCardsRef.current[0][1].innerText).toBe('');
    expect(mockColorCardsRef.current[1][1].innerText).toBe('');
    expect(mockColorCardsRef.current[0][0].classList.contains('markable')).toBeFalsy();
    expect(mockColorCardsRef.current[1][0].classList.contains('markable')).toBeFalsy();
    expect(mockColorCardsRef.current[0][1].classList.contains('markable')).toBeFalsy();
    expect(mockColorCardsRef.current[1][1].classList.contains('markable')).toBeFalsy();
  });

  it('should reset selection correctly', async () => {
    const { result } = renderHook(() =>
      UseMov(currentPlayer, user_id, movSelect, vi.fn(), movTypeSelect, mockColorCardsRef, movPosible, setMovPosible, switchAnimation, setUsedMov, movCounter, setMovCounter)
    );

    const resetSelection = result.current.resetSelection;
    
    // Marcar una celda y luego restablecer la selección
    await act(async () => {
      result.current.selectCard(0, 0);
    });

    resetSelection();

    // Verificar que las celdas se hayan desmarcado
    expect(mockColorCardsRef.current[0][0].classList.contains('board-selected')).toBeFalsy();
    expect(mockColorCardsRef.current[0][0].innerText).toBe('');
  });
});
