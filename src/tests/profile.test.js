import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from '../components/Profile';
import { act } from 'react';

// navigate to mock route
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('Profile Component', () => {
  const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
    profilePicture: 'https://example.com/pic.jpg',
    lastLogin: new Date().toISOString()
  };
  //mock data for projects and tasks
  const mockProjects = [
    { 
      _id: '1', 
      name: 'Project 1', 
      description: 'Test Project 1' 
    }
  ];

  const mockTasks = [
    { 
      _id: '1', 
      name: 'Task 1', 
      project: { _id: '1', name: 'Project 1' }, 
      description: 'Test Task 1', 
      duration: 2 
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });
//check if profile renders correctly with mock data
  test('renders user profile data after loading', async () => {
    global.fetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProjects)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTasks)
      }));

    await act(async () => {
      render(<Profile />);
    });

    await waitFor(() => {
      expect(screen.getByText(`Welcome, ${mockUser.name}!`)).toBeInTheDocument();
      expect(screen.getByText(`Email: ${mockUser.email}`)).toBeInTheDocument();
    });
  });
  //render new project creation test case
  test('handles new project creation', async () => {
    const newProject = { 
      name: 'New Project', 
      description: 'Test Description',
      _id: '2'
    };

    global.fetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProjects)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTasks)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(newProject)
      }));

    await act(async () => {
      render(<Profile />);
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Project Name')).toBeInTheDocument();
    });

   
    const nameInput = screen.getByPlaceholderText('Project Name');
    const descInput = screen.getByPlaceholderText('Project Description');

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: newProject.name } });
      fireEvent.change(descInput, { target: { value: newProject.description } });
    });

    
    const createButtons = screen.getAllByText('Create');
    const projectCreateButton = createButtons[0]; // First Create button is for projects

    await act(async () => {
      fireEvent.click(projectCreateButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BACKEND_URL}/api/projects`,
        expect.any(Object)
      );
    });
  });
//test case for not logged in user render
  test('handles error state', async () => {
    const errorMessage = 'Failed to fetch';
    
    
    global.fetch.mockRejectedValueOnce(new Error(errorMessage));

    let rendered;
    await act(async () => {
      rendered = render(<Profile />);
    });

  
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByText('Return to Login')).toBeInTheDocument();
    });
  });
//case for user logging out
  test('handles logout', async () => {
    global.fetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProjects)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTasks)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Logged out successfully' })
      }));

    await act(async () => {
      render(<Profile />);
    });

    await waitFor(() => {
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    const logoutButton = screen.getByText('Logout');
    await act(async () => {
      fireEvent.click(logoutButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BACKEND_URL}/logout`,
        expect.any(Object)
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
//project removal erneder case
  test('handles project deletion', async () => {
    global.fetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockProjects)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTasks)
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Project deleted successfully' })
      }));

    await act(async () => {
      render(<Profile />);
    });

    await waitFor(() => {
      expect(screen.getAllByText('Done')[0]).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByText('Done')[0];
    await act(async () => {
      fireEvent.click(deleteButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BACKEND_URL}/api/projects/1`,
        expect.objectContaining({
          method: 'DELETE'
        })
      );
    });
  });
});