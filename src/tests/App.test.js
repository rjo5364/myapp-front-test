import { render, screen } from '@testing-library/react';
import App from '../App';

// setting up mock routing
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ children }) => <div>{children}</div>
}));
//case for loading app and mock routes
describe('App Component', () => {
  test('renders App without crashing', () => {
    render(<App />);
  });
});