import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newProject, setNewProject] = useState({ name: "", description: "" });
  const [newTask, setNewTask] = useState({
    project: "",
    name: "",
    description: "",
    duration: 0,
    startDate: "",
    endDate: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/profile`, {
          credentials: "include",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
        });
        if (!profileResponse.ok) throw new Error("User not authenticated");
        const profileData = await profileResponse.json();
        setUser(profileData);

        // Fetch user's projects and tasks
        const projectsResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects`, { credentials: "include" });
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);

        const tasksResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks`, { credentials: "include" });
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
      } catch (err) {
        setError(err.message);
        if (err.message === "User not authenticated") {
          setTimeout(() => navigate("/"), 2000); // Redirect to login
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
        method: "GET",
        credentials: "include",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
      });
      if (response.ok) navigate("/");
      else throw new Error("Logout failed");
    } catch (err) {
      setError("Failed to logout. Please try again.");
    }
  };

  const handleAddProject = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProject }),
        credentials: "include",
      });

      if (response.ok) {
        const project = await response.json();
        setProjects([...projects, project]);
        setNewProject({ name: "", description: "" });
      } else {
        throw new Error("Error adding project");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newTask }),
        credentials: "include",
      });

      if (response.ok) {
        const task = await response.json();
        setTasks([...tasks, task]);
        setNewTask({
          project: "",
          name: "",
          description: "",
          duration: 0,
          startDate: "",
          endDate: "",
        });
      } else {
        throw new Error("Error adding task");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkComplete = async (taskId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/tasks/${taskId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== taskId));
      } else {
        throw new Error("Error deleting task");
      }
    } catch (err) {
      setError(err.message);
    }
  };

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
          <button onClick={() => navigate("/")} style={styles.button}>
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.topbar}>
        <h1>MyProjects</h1>
      </div>

      <div style={styles.mainContent}>
        <div style={styles.sidebar}>
          <h2>Welcome, {user.name}!</h2>
          {user.profilePicture && <img src={user.profilePicture} alt="Profile" style={styles.image} />}
          <p>Email: {user.email}</p>
          <p>Last login: {new Date(user.lastLogin).toLocaleString()}</p>
          <button onClick={handleLogout} style={styles.button}>Logout</button>

          <div style={styles.formContainer}>
            <h3>New Project</h3>
            <input
              type="text"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              placeholder="Project Name"
            />
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Project Description"
            />
            <button onClick={handleAddProject}>Create</button>

            <h3>New Task</h3>
            <select
              value={newTask.project}
              onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
            >
              <option value="">Select Project</option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newTask.name}
              onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              placeholder="Task Name"
            />
            <input
              type="number"
              value={newTask.duration}
              onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
              placeholder="Duration"
            />
            <input
              type="date"
              value={newTask.startDate}
              onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
            />
            <input
              type="date"
              value={newTask.endDate}
              onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
            />
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Task Description"
            />
            <button onClick={handleAddTask}>Create</button>
          </div>
        </div>

        <div style={styles.content}>
          <h2>Current Projects</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id}>
                  <td>{project.name}</td>
                  <td>{project.description}</td>
                  <td><button>Done</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>Current Tasks</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Parent Project</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.name}</td>
                  <td>{task.project.name}</td>
                  <td>{task.description}</td>
                  <td>{task.duration}</td>
                  <td>
                    <button onClick={() => handleMarkComplete(task._id)}>Done</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  topbar: {
    backgroundColor: "#0077b5",
    color: "white",
    padding: "10px 20px",
    textAlign: "center",
    fontSize: "2rem",
  },
  mainContent: {
    display: "flex",
    flex: 1,
    gap: "20px",
    padding: "20px",
  },
  sidebar: {
    width: "25%",
    backgroundColor: "#f4f4f9",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  content: {
    width: "70%",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  image: {
    borderRadius: "50%",
    width: "100px",
    height: "100px",
    marginBottom: "1rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
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
