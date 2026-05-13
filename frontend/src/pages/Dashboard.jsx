import React, { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // State for Task Form Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Fetch tasks when component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await API.get("/tasks");
      setTasks(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch tasks. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle saving a task (Create or Update)
  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        // Update existing task
        const response = await API.put(`/tasks/${editingTask._id}`, taskData);
        setTasks(tasks.map((t) => (t._id === editingTask._id ? response.data : t)));
      } else {
        // Create new task
        const response = await API.post("/tasks", taskData);
        setTasks([response.data, ...tasks]); // Add new task to top of list
      }
      closeForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save task");
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await API.delete(`/tasks/${id}`);
        setTasks(tasks.filter((t) => t._id !== id));
      } catch (err) {
        setError("Failed to delete task");
      }
    }
  };

  // Open form for creating a new task
  const openNewTaskForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  // Open form for editing a task
  const openEditTaskForm = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  // Filter and search logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <Navbar />
      
      <main className="container">
        <div className="dashboard-tools">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search tasks by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control search-input"
            />
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-control"
              style={{ width: "auto" }}
            >
              <option value="All">All Statuses</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <button className="btn add-task-btn" onClick={openNewTaskForm}>
            + Add New Task
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {loading ? (
          <div className="text-center mt-3">Loading tasks...</div>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={openEditTaskForm}
                  onDelete={handleDeleteTask}
                />
              ))
            ) : (
              <div className="empty-state">
                <h3>No tasks found</h3>
                <p>Try adjusting your search/filter or add a new task!</p>
              </div>
            )}
          </div>
        )}
      </main>

      {isFormOpen && (
        <TaskForm
          onSave={handleSaveTask}
          onCancel={closeForm}
          initialData={editingTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
