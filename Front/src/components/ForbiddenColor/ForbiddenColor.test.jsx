import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';
import ForbiddenColor from './ForbiddenColor';

describe('ForbiddenColor Component', () => {
    it('renders with default color', () => {
        render(<ForbiddenColor color="" />);
        const container = screen.getByAltText('forbidden icon').parentElement;
        expect(container).toHaveStyle({ backgroundColor: '#333' });
        expect(screen.getByText('None')).toBeInTheDocument();
    });

    it('renders with red color', () => {
        render(<ForbiddenColor color="r" />);
        const container = screen.getByAltText('forbidden icon').parentElement;
        expect(container).toHaveStyle({ backgroundColor: '#df5d4f' });
        expect(screen.getByText('Red')).toBeInTheDocument();
    });

    it('renders with blue color', () => {
        render(<ForbiddenColor color="b" />);
        const container = screen.getByAltText('forbidden icon').parentElement;
        expect(container).toHaveStyle({ backgroundColor: '#61b5a4' });
        expect(screen.getByText('Blue')).toBeInTheDocument();
    });

    it('renders with green color', () => {
        render(<ForbiddenColor color="g" />);
        const container = screen.getByAltText('forbidden icon').parentElement;
        expect(container).toHaveStyle({ backgroundColor: '#a7b552' });
        expect(screen.getByText('Green')).toBeInTheDocument();
    });

    it('renders with yellow color', () => {
        render(<ForbiddenColor color="y" />);
        const container = screen.getByAltText('forbidden icon').parentElement;
        expect(container).toHaveStyle({ backgroundColor: '#f3d25c' });
        expect(screen.getByText('Yellow')).toBeInTheDocument();
    });
});