import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PassBotton } from './pass_botton';  // Asegúrate de que el nombre del archivo sea el correcto
import '@testing-library/jest-dom';

import api from '../../services/api';

vi.mock('../../services/api', () => {
  return {
    default: { fetchData: vi.fn(), postData: vi.fn(), putData: vi.fn() },
    api: vi.fn(),
  };
});


describe('PassBotton', () => {  
  const match_id = 1;
  const mockSetMovCounter = vi.fn();
  const mockSetUsedMov = vi.fn();
  const mockSetReload = vi.fn();

  beforeEach(() => {
    render(<PassBotton match_id={match_id} setMovCounter={mockSetMovCounter} setUsedMov={mockSetUsedMov} 
                        setReload={mockSetReload} />);
  });

  it('should render the button', () => {

    expect(screen.getByText('Pass Turn')).toBeInTheDocument(); 
  });

  it('should call the API when the button is clicked', () => {
    fireEvent.click(screen.getByText('Pass Turn'));  
    expect(api.putData).toHaveBeenCalled();

  });
});
