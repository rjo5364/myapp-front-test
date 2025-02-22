import { render, screen } from '@testing-library/react';
import Login from '../components/Login';

// call mock rounting
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>
}));

describe('Login Component', () => {
  beforeEach(() => {
    // Backend URL for testing
    process.env.REACT_APP_BACKEND_URL = 'http://localhost:5000';
    render(<Login />);
  });
    //text render case
  test('renders welcome message', () => {
    expect(screen.getByText('Welcome')).toBeInTheDocument();
  });
  //link render case
  test('renders login instruction text', () => {
    expect(screen.getByText('Please log in using one of the following:')).toBeInTheDocument();
  });
  //button render case
  test('renders Google login button with correct link', () => {
    const googleButton = screen.getByText('Login with Google');
    expect(googleButton).toBeInTheDocument();
    expect(googleButton.closest('a')).toHaveAttribute(
      'href',
      `${process.env.REACT_APP_BACKEND_URL}/auth/google`
    );
  });
  //github button render case
  test('renders GitHub login button with correct link', () => {
    const githubButton = screen.getByText('Login with GitHub');
    expect(githubButton).toBeInTheDocument();
    expect(githubButton.closest('a')).toHaveAttribute(
      'href',
      `${process.env.REACT_APP_BACKEND_URL}/auth/github`
    );
  });
});
