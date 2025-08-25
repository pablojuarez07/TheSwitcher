import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LeaveButton } from './leave_button';
import '@testing-library/jest-dom';

import api from '../../services/api';

// Mock de api
vi.mock('../../services/api', () => ({
    default: { fetchData: vi.fn(), postData: vi.fn(), putData: vi.fn() },
    api: vi.fn(),
}));

describe('LeaveButton', () => {
  const setScreen = vi.fn();
    beforeEach(() => {
        const player_id = 1;
        render(<LeaveButton player_id={player_id} setScreen={setScreen}/>);

    });
    
    it('should render Leave button', () => {
        expect(screen.getByText('Leave')).toBeInTheDocument();
    });
    

    it('should call put on button click', async () => {
        fireEvent.click(screen.getByText('Leave'));
        expect(api.putData).toHaveBeenCalled();
    });

    it('should call setScreen on button click', async () => {
        fireEvent.click(screen.getByText('Leave'));
        expect(setScreen).toHaveBeenCalled();

    });
    });