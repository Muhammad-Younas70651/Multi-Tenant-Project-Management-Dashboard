
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  Users as UsersIcon,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ShieldCheck,
  UserRound,
  CheckCircle2,
  Ban,
} from "lucide-react";

type UserRole = "Superadmin" | "Tenant Admin" | "Team Member";
type UserStatus = "Active" | "Inactive";

interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenant: string;
  status: UserStatus;
}

const STORAGE_KEY = "projectflow_users";

const initialUsers: TeamUser[] = [
  { id: "USR-001", name: "Muhammad Younas", email: "younas@example.com", role: "Superadmin", tenant: "Platform", status: "Active" },
  { id: "USR-002", name: "Ali Khan", email: "ali@example.com", role: "Tenant Admin", tenant: "Acme Corporation", status: "Active" },
  { id: "USR-003", name: "Sara Ahmed", email: "sara@example.com", role: "Team Member", tenant: "Bright Solutions", status: "Active" },
  { id: "USR-004", name: "Ahmed Khan", email: "ahmed@example.com", role: "Team Member", tenant: "Nova Technologies", status: "Inactive" },
];

const emptyForm = {
  name: "",
  email: "",
  role: "Team Member" as UserRole,
  tenant: "",
  status: "Active" as UserStatus,
};

export default function Users() {
  const [users, setUsers] = useState<TeamUser[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as TeamUser[]) : initialUsers;
    } catch {
      return initialUsers;
    }
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query) ||
        user.tenant.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (roleFilter === "All" || user.role === roleFilter) &&
        (statusFilter === "All" || user.status === statusFilter)
      );
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const activeCount = users.filter((user) => user.status === "Active").length;
  const inactiveCount = users.length - activeCount;
  const adminCount = users.filter(
    (user) => user.role === "Superadmin" || user.role === "Tenant Admin",
  ).length;

  function openAddModal() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  }

  function openEditModal(user: TeamUser) {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      tenant: user.tenant,
      status: user.status,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const email = form.email.trim().toLowerCase();
    const name = form.name.trim();
    const tenant = form.role === "Superadmin" ? "Platform" : form.tenant.trim();

    if (
      users.some(
        (user) =>
          user.email.toLowerCase() === email && user.id !== editingId,
      )
    ) {
      window.alert("A user with this email address already exists.");
      return;
    }

    if (editingId) {
      setUsers((current) =>
        current.map((user) =>
          user.id === editingId
            ? { ...user, ...form, name, email, tenant }
            : user,
        ),
      );
    } else {
      const newUser: TeamUser = {
        id: `USR-${Date.now()}`,
        name,
        email,
        role: form.role,
        tenant,
        status: form.status,
      };

      setUsers((current) => [newUser, ...current]);
      setPage(1);
    }

    closeModal();
  }

  function toggleStatus(user: TeamUser) {
    setUsers((current) =>
      current.map((item) =>
        item.id === user.id
          ? {
              ...item,
              status: item.status === "Active" ? "Inactive" : "Active",
            }
          : item,
      ),
    );
  }

  function deleteUser(user: TeamUser) {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      setUsers((current) => current.filter((item) => item.id !== user.id));
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-blue-400">Administration</p>
          <h1 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            User Management
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage users, roles, tenant assignments, and account status.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500"
        >
          <Plus size={18} />
          Add User
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={users.length} icon={<UsersIcon size={21} />} />
        <StatCard label="Active Users" value={activeCount} icon={<CheckCircle2 size={21} />} />
        <StatCard label="Inactive Users" value={inactiveCount} icon={<Ban size={21} />} />
        <StatCard label="Administrators" value={adminCount} icon={<ShieldCheck size={21} />} />
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="flex flex-col gap-3 border-b border-slate-800 p-4 lg:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search name, email, ID, or tenant..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="All">All roles</option>
            <option value="Superadmin">Superadmin</option>
            <option value="Tenant Admin">Tenant Admin</option>
            <option value="Team Member">Team Member</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
          >
            <option value="All">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]text-left text-sm">
            <thead className="bg-slate-950/70 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-4 font-medium">User</th>
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Tenant</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {visibleUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                        <UserRound size={19} />
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{user.email}</p>
                        <p className="mt-1 text-xs text-slate-500">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-5 py-4 text-slate-300">{user.tenant}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(user)}
                        title="Edit user"
                        aria-label={`Edit ${user.name}`}
                        className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-blue-500 hover:text-blue-400"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStatus(user)}
                        title={user.status === "Active" ? "Deactivate user" : "Activate user"}
                        aria-label={`Change status for ${user.name}`}
                        className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-amber-500 hover:text-amber-400"
                      >
                        {user.status === "Active" ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteUser(user)}
                        title="Delete user"
                        aria-label={`Delete ${user.name}`}
                        className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-red-500 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visibleUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <UsersIcon className="mx-auto mb-3 text-slate-600" size={32} />
                    <p className="font-medium text-slate-300">No users found</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-800 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            Showing {filteredUsers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            {" "}to {Math.min(currentPage * pageSize, filteredUsers.length)} of {filteredUsers.length} users
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="px-2 text-sm text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-title"
            className="my-auto w-full max-w-xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 p-5">
              <div>
                <h2 id="user-modal-title" className="text-xl font-semibold text-white">
                  {editingId ? "Edit User" : "Add New User"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">Enter the account details below.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close dialog"
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label htmlFor="user-name" className="mb-2 block text-sm text-slate-300">
                  Full name
                </label>
                <input
                  id="user-name"
                  required
                  minLength={2}
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="user-email" className="mb-2 block text-sm text-slate-300">
                  Email address
                </label>
                <input
                  id="user-email"
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="user-role" className="mb-2 block text-sm text-slate-300">
                    Role
                  </label>
                  <select
                    id="user-role"
                    value={form.role}
                    onChange={(event) => setForm({ ...form, role: event.target.value as UserRole })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
                  >
                    <option value="Superadmin">Superadmin</option>
                    <option value="Tenant Admin">Tenant Admin</option>
                    <option value="Team Member">Team Member</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="user-status" className="mb-2 block text-sm text-slate-300">
                    Status
                  </label>
                  <select
                    id="user-status"
                    value={form.status}
                    onChange={(event) => setForm({ ...form, status: event.target.value as UserStatus })}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {form.role !== "Superadmin" && (
                <div>
                  <label htmlFor="user-tenant" className="mb-2 block text-sm text-slate-300">
                    Tenant / Organization
                  </label>
                  <input
                    id="user-tenant"
                    required
                    value={form.tenant}
                    onChange={(event) => setForm({ ...form, tenant: event.target.value })}
                    placeholder="Enter organization name"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  {editingId ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-400">{label}</p>
        <span className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">{icon}</span>
      </div>
      <p className="mt-4 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const styles: Record<UserRole, string> = {
    Superadmin: "bg-violet-500/10 text-violet-300",
    "Tenant Admin": "bg-blue-500/10 text-blue-300",
    "Team Member": "bg-slate-700 text-slate-300",
  };

  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${styles[role]}`}>
      {role}
    </span>
  );
}
