import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [newTask, setNewTask] = useState({ project: "", name: "", description: "", duration: 0, startDate: "", endDate: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch user profile
        const profileResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/profile`, {
          credentials: 'include',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        });
        if (!profileResponse.ok) throw new Error('User not authenticated');
        const profileData = await profileResponse.json();
        setUser(profileData);

        // Fetch user's projects
        const projectsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects`, { credentials: 'include' });
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);

        // Fetch user's tasks
        const tasksResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks`, { credentials: 'include' });
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      } catch (err) {
        setError(err.message);
        if (err.message === 'User not authenticated') {
          setTimeout(() => navigate('/'), 2000); // Redirect to login if user is not authenticated
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/logout`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      });
      if (response.ok) navigate('/');
      else throw new Error('Logout failed');
    } catch (err) {
      setError('Failed to logout. Please try again.');
    }
  };

  const handleAddProject = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProject }),
        credentials: 'include'
      });

      if (response.ok) {
        const project = await response.json();
        setProjects([...projects, project]);
        setNewProject({ name: "", description: "" });
      } else {
        throw new Error('Error adding project');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newTask }),
        credentials: 'include'
      });

      if (response.ok) {
        const task = await response.json();
        setTasks([...tasks, task]);
        setNewTask({ project: "", name: "", description: "", duration: 0, startDate: "", endDate: "" });
      } else {
        throw new Error('Error adding task');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e, setter) => setter({ ...newProject, [e.target.name]: e.target.value });

  const handleTaskInputChange = (e, setter) => setter({ ...newTask, [e.target.name]: e.target.value });

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.box}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.box}>
          <h2>{error}</h2>
          <button onClick={() => navigate('/')} style={styles.button}>Return to Login</button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h1>Welcome, {user.name}!</h1>
        {user.profilePicture && <img src={user.profilePicture} alt="Profile" style={styles.image} />}
        <p style={styles.email}>Email: {user.email}</p>
        {user.lastLogin && <p style={styles.lastLogin}>Last login: {new Date(user.lastLogin).toLocaleString()}</p>}
        <button onClick={handleLogout} style={styles.button}>Logout</button>
      </div>

      <div style={styles.box}>
        <h2>Your Projects</h2>
        <ul>
          {projects.map(project => (
            <li key={project._id}>{project.name}</li>
          ))}
        </ul>
        <h3>Add New Project</h3>
        <input
          type="text"
          name="name"
          value={newProject.name}
          onChange={(e) => handleInputChange(e, setNewProject)}
          placeholder="Project Name"
        />
        <textarea
          name="description"
          value={newProject.description}
          onChange={(e) => handleInputChange(e, setNewProject)}
          placeholder="Project Description"
        />
        <button onClick={handleAddProject}>Add Project</button>
      </div>

      <div style={styles.box}>
        <h2>Your Tasks</h2>
        <ul>
          {tasks.map(task => (
            <li key={task._id}>{task.name} - Project: {task.project.name}</li>
          ))}
        </ul>
        <h3>Add New Task</h3>
        <select
          name="project"
          value={newTask.project}
          onChange={(e) => handleTaskInputChange(e, setNewTask)}
        >
          <option value="">Select Project</option>
          {projects.map(project => (
            <option key={project._id} value={project._id}>{project.name}</option>
          ))}
        </select>
        <input
          type="text"
          name="name"
          value={newTask.name}
          onChange={(e) => handleTaskInputChange(e, setNewTask)}
          placeholder="Task Name"
        />
        <textarea
          name="description"
          value={newTask.description}
          onChange={(e) => handleTaskInputChange(e, setNewTask)}
          placeholder="Task Description"
        />
        <input
          type="number"
          name="duration"
          value={newTask.duration}
          onChange={(e) => handleTaskInputChange(e, setNewTask)}
          placeholder="Duration"
        />
        <input
          type="date"
          name="startDate"
          value={newTask.startDate}
          onChange={(e) => handleTaskInputChange(e, setNewTask)}
        />
        <input
          type="date"
          name="endDate"
          value={newTask.endDate}
          onChange={(e) => handleTaskInputChange(e, setNewTask)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#f4f4f9",
    padding: "1rem",
  },
  box: {
    textAlign: "center",
    padding: "2rem",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    width: "100%",
    marginBottom: "2rem",
  },
  image: {
    borderRadius: "50%",
    margin: "1rem 0",
    width: "100px",
    height: "100px",
    objectFit: "cover",
    border: "2px solid #f4f4f9",
  },
  email: {
    color: "#666",
    margin: "1rem 0",
  },
  lastLogin: {
    color: "#888",
    fontSize: "0.9rem",
    marginBottom: "1rem",
  },
  button: {
    backgroundColor: "#0077b5",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
  },
};

export default Profile;
