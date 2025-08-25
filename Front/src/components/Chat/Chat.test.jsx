import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom'; // Importa las extensiones
import Chat from './Chat';
import { useWebSocket } from "../../services/websocket";
import api from "../../services/api";

vi.mock("../../services/websocket");
vi.mock("../../services/api");

describe('Chat Component', () => {
    const mockWs = {
        on: vi.fn(),
        off: vi.fn(),
    };

    beforeEach(() => {
        useWebSocket.mockReturnValue(mockWs);
    });

    it('renders the chat input and send button', () => {
        const { getByRole } = render(<Chat player_id="123" />);
        expect(getByRole('textbox')).toBeInTheDocument();
        expect(getByRole('button')).toBeInTheDocument();
    });

    it('sends a message when the send button is clicked', async () => {
        api.putData.mockResolvedValue({ status: 200 });
        const { getByRole } = render(<Chat player_id="123" />);
        const input = getByRole('textbox');
        const button = getByRole('button');

        fireEvent.change(input, { target: { value: 'Hello' } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(api.putData).toHaveBeenCalledWith(
                'players/123/send_message',
                { content: 'Hello' }
            );
        });
    });

});