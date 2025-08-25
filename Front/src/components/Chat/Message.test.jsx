import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom'; // Importa las extensiones
import Message from './Message';

describe('Message Component', () => {
    const mockData = {
        "message_type": "PlayerMessage",
        "content": "SwitcherMaster: Hola q hacen? Como estan todos",
        "time_sent": "16:19"
    };

    it('renders the message sender and body correctly', () => {
        const { getByText } = render(<Message msgsData={mockData} />);
        expect(getByText('SwitcherMaster')).toBeInTheDocument();
        expect(getByText('Hola q hacen? Como estan todos')).toBeInTheDocument();
    });

    it('renders the timestamp correctly', () => {
        const { getByText } = render(<Message msgsData={mockData} />);
        expect(getByText('16:19')).toBeInTheDocument();
    });

    it('applies the correct style for log messages', () => {
        const logData = {
            "message_type": "LogMessage",
            "content": "System: Log message",
            "time_sent": "16:20"
        };
        const { getByText } = render(<Message msgsData={logData} />);
        expect(getByText('[Log]')).toBeInTheDocument();
    });
});