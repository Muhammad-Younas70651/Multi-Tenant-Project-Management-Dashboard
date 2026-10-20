import { useEffect, useMemo, useState } from "react";
import {
  CheckSquare,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  Clock,
} from "lucide-react";

type TaskStatus = "To Do" | "In Progress" | "Completed";
type TaskPriority = "Low" | "Medium" | "High";

interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  assignee: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

const initialTasks: Task[] = [
  {
    id: "TSK-1001",
    title: "Design dashboard UI",
    description: "Create the responsive dashboard design.",
    project: "Website Redesign",
    assignee: "Ali Khan",
    priority: "High",
    status: "In Progress",
    dueDate: "2026-11-05",
  },
  {
    id: "TSK-1002",
    title: "Implement login page",
    description: "Build the login form and validation.",
    project: "Mobile Application",
    assignee: "Sara Ahmed",
    priority: "Medium",
    status: "To Do",
    dueDate: "2026-11-10",
  },
  {
    id: "TSK-1003",
    title: "Test API integration",
    description: "Verify API responses and error handling.",
    project: "Admin Dashboard",
    assignee: "Ahmed Khan",
    priority: "Low",
    status: "Completed",
    dueDate: "2026-10-15",
  },
];

const emptyForm = {
  title: "",
  description: "",
  project: "",
  assignee: "",
  priority: "Medium" as TaskPriority,
  status: "To Do" as TaskStatus,
  dueDate: "",
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem("projectflow_tasks");
      return saved ? (JSON.parse(saved) as Task[]) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  useEffect(() => {
    localStorage.setItem("projectflow_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const term = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(term) ||
        task.project.toLowerCase().includes(term) ||
        task.assignee.toLowerCase().includes(term) ||
        task.id.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const visibleTasks = filteredTasks.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  }

  function openEditModal(task: Task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      project: task.project,
      assignee: task.assignee,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
    });
    setError("");
    setModalOpen(true);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const title = form.title.trim();
    const project = form.project.trim();
    const assignee = form.assignee.trim();

    if (!title || !project || !assignee) {
      setError("Task title, project, and assignee are required.");
      return;
    }

    if (editingId) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingId
            ? { ...task, ...form, title, project, assignee }
            : task
        )
      );
    } else {
      const newTask: Task = {
        ...form,
        id: `TSK-${Date.now().toString().slice(-6)}`,
        title,
        project,
        assignee,
      };

      setTasks((previous) => [newTask, ...previous]);
      setCurrentPage(1);
    }

    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  function deleteTask(id: string) {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setTasks((previous) => previous.filter((task) => task.id !== id));
  }

  function updateTaskStatus(id: string, status: TaskStatus) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setCurrentPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Task Management
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Assign tasks, track progress, and manage deadlines.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
        >
          <Plus size={18} />
          Create Task
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          title="Total Tasks"
          value={tasks.length}
          icon={<CheckSquare size={21} />}
        />
        <SummaryCard
          title="In Progress"
          value={inProgressCount}
          icon={<Clock size={21} />}
        />
        <SummaryCard
          title="Completed"
          value={completedCount}
          icon={<CalendarDays size={21} />}
        />
      </div>

      {/* Search and filters */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search tasks, projects, assignees..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            setCurrentPage(1);
          }}
          className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-200 outline-none focus:border-blue-500"
        >
          <option value="All">All statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(event) => {
            setPriorityFilter(event.target.value);
            setCurrentPage(1);
          }}
          className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-200 outline-none focus:border-blue-500"
        >
          <option value="All">All priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Tasks table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-800 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-white">All Tasks</h2>
            <p className="mt-1 text-sm text-slate-400">
              {filteredTasks.length} task(s) found
            </p>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="self-start rounded-lg px-3 py-2 text-sm text-blue-400 hover:bg-slate-800"
          >
            Reset filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]text-left text-sm">
            <thead className="bg-slate-950/70 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Task</th>
                <th className="px-5 py-4">Project</th>
                <th className="px-5 py-4">Assignee</th>
                <th className="px-5 py-4">Priority</th>
                <th className="px-5 py-4">Due Date</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {visibleTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-800/40">
                  <td className="px-5 py-4">
                    <p className="font-medium text-white">{task.title}</p>
                    <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                      {task.description || "No description"}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">{task.id}</p>
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {task.project}
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {task.assignee}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1.5 text-xs font-medium ${
                        task.priority === "High"
                          ? "bg-rose-500/10 text-rose-400"
                          : task.priority === "Medium"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    {task.dueDate || "Not set"}
                  </td>

                  <td className="px-5 py-4">
                    <select
                      aria-label={`Status for ${task.title}`}
                      value={task.status}
                      onChange={(event) =>
                        updateTaskStatus(
                          task.id,
                          event.target.value as TaskStatus
                        )
                      }
                      className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-2 text-xs text-slate-200 outline-none focus:border-blue-500"
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        title="Edit task"
                        aria-label={`Edit ${task.title}`}
                        onClick={() => openEditModal(task)}
                        className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-blue-500 hover:text-blue-400"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        title="Delete task"
                        aria-label={`Delete ${task.title}`}
                        onClick={() => deleteTask(task.id)}
                        className="rounded-lg border border-slate-700 p-2 text-rose-400 hover:border-rose-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visibleTasks.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <CheckSquare
                      size={32}
                      className="mx-auto mb-3 text-slate-600"
                    />
                    <p className="font-medium text-slate-300">
                      No tasks found
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your filters or create a task.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            Showing{" "}
            {filteredTasks.length === 0
              ? 0
              : (safePage - 1) * pageSize + 1}
            {" "}to{" "}
            {Math.min(safePage * pageSize, filteredTasks.length)}
            {" "}of {filteredTasks.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage(safePage - 1)}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-slate-400">
              Page {safePage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage(safePage + 1)}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Create/Edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100]flex items-center justify-center overflow-y-auto bg-black/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-modal-title"
            className="my-auto w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="task-modal-title"
                  className="text-xl font-bold text-white"
                >
                  {editingId ? "Edit Task" : "Create Task"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Enter the task details below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="task-title"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Task title
                </label>
                <input
                  id="task-title"
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="Enter task title"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="task-description"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Description
                </label>
                <textarea
                  id="task-description"
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Describe the task"
                  className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="task-project"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Project
                  </label>
                  <input
                    id="task-project"
                    required
                    value={form.project}
                    onChange={(event) =>
                      setForm({ ...form, project: event.target.value })
                    }
                    placeholder="Project name"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="task-assignee"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Assignee
                  </label>
                  <input
                    id="task-assignee"
                    required
                    value={form.assignee}
                    onChange={(event) =>
                      setForm({ ...form, assignee: event.target.value })
                    }
                    placeholder="Team member"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="task-priority"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Priority
                  </label>
                  <select
                    id="task-priority"
                    value={form.priority}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        priority: event.target.value as TaskPriority,
                      })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="task-status"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Status
                  </label>
                  <select
                    id="task-status"
                    value={form.status}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value as TaskStatus,
                      })
                    }
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="task-due-date"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Due date
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  value={form.dueDate}
                  onChange={(event) =>
                    setForm({ ...form, dueDate: event.target.value })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-rose-400">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  {editingId ? "Save Changes" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function SummaryCard({ title, value, icon }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{title}</p>
        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
