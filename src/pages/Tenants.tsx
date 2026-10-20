import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Search,
  Plus,
  Pencil,
  Power,
  X,
  Users,
  FolderKanban,
} from "lucide-react";

interface Tenant {
  id: string;
  name: string;
  email: string;
  plan: "Free" | "Pro" | "Enterprise";
  status: "Active" | "Inactive";
  members: number;
  createdAt: string;
}

const initialTenants: Tenant[] = [
  {
    id: "TEN-001",
    name: "Acme Corporation",
    email: "admin@acme.com",
    plan: "Enterprise",
    status: "Active",
    members: 24,
    createdAt: "2026-01-15",
  },
  {
    id: "TEN-002",
    name: "Bright Solutions",
    email: "admin@bright.com",
    plan: "Pro",
    status: "Active",
    members: 12,
    createdAt: "2026-02-08",
  },
  {
    id: "TEN-003",
    name: "Nova Technologies",
    email: "admin@nova.com",
    plan: "Free",
    status: "Inactive",
    members: 5,
    createdAt: "2026-03-12",
  },
];

const emptyForm = {
  name: "",
  email: "",
  plan: "Free" as Tenant["plan"],
  members: 1,
};

export default function Tenants() {
  const [tenants, setTenants] = useState<Tenant[]>(() => {
    try {
      const saved = localStorage.getItem("projectflow_tenants");
      return saved ? JSON.parse(saved) as Tenant[] : initialTenants;
    } catch {
      return initialTenants;
    }
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    localStorage.setItem("projectflow_tenants", JSON.stringify(tenants));
  }, [tenants]);

  const filteredTenants = useMemo(() => {
    const term = search.trim().toLowerCase();

    return tenants.filter((tenant) => {
      const matchesSearch =
        tenant.name.toLowerCase().includes(term) ||
        tenant.email.toLowerCase().includes(term) ||
        tenant.id.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === "All" || tenant.status === statusFilter;

      const matchesPlan =
        planFilter === "All" || tenant.plan === planFilter;

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [tenants, search, statusFilter, planFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTenants.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const visibleTenants = filteredTenants.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const activeCount = tenants.filter(
    (tenant) => tenant.status === "Active"
  ).length;

  const inactiveCount = tenants.filter(
    (tenant) => tenant.status === "Inactive"
  ).length;

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(tenant: Tenant) {
    setEditingId(tenant.id);
    setForm({
      name: tenant.name,
      email: tenant.email,
      plan: tenant.plan,
      members: tenant.members,
    });
    setModalOpen(true);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email) return;

    if (
      tenants.some(
        (tenant) =>
          tenant.email.toLowerCase() === email.toLowerCase() &&
          tenant.id !== editingId
      )
    ) {
      window.alert("A tenant with this email already exists.");
      return;
    }

    if (editingId) {
      setTenants((previous) =>
        previous.map((tenant) =>
          tenant.id === editingId
            ? { ...tenant, name, email, plan: form.plan, members: form.members }
            : tenant
        )
      );
    } else {
      const newTenant: Tenant = {
        id: `TEN-${Date.now().toString().slice(-6)}`,
        name,
        email,
        plan: form.plan,
        status: "Active",
        members: form.members,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      setTenants((previous) => [newTenant, ...previous]);
      setCurrentPage(1);
    }

    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function toggleTenantStatus(id: string) {
    setTenants((previous) =>
      previous.map((tenant) =>
        tenant.id === id
          ? {
              ...tenant,
              status: tenant.status === "Active" ? "Inactive" : "Active",
            }
          : tenant
      )
    );
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setPlanFilter("All");
    setCurrentPage(1);
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Tenant Management
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Create, manage, and monitor your workspace tenants.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          <Plus size={18} />
          Add Tenant
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Total Tenants"
          value={tenants.length}
          icon={<Building2 size={21} />}
        />
        <SummaryCard
          title="Active Tenants"
          value={activeCount}
          icon={<Users size={21} />}
        />
        <SummaryCard
          title="Inactive Tenants"
          value={inactiveCount}
          icon={<FolderKanban size={21} />}
        />
      </div>

      {/* Search and filters */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
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
              placeholder="Search name, email or ID..."
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
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={planFilter}
            onChange={(event) => {
              setPlanFilter(event.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-200 outline-none focus:border-blue-500"
          >
            <option value="All">All plans</option>
            <option value="Free">Free</option>
            <option value="Pro">Pro</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
      </div>

      {/* Tenants table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-800 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-white">All Tenants</h2>
            <p className="mt-1 text-sm text-slate-400">
              {filteredTenants.length} tenant
              {filteredTenants.length === 1 ? "" : "s"} found
            </p>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="self-start rounded-lg px-3 py-2 text-sm text-blue-400 hover:bg-slate-800 sm:self-auto"
          >
            Reset filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px]text-left text-sm">
            <thead className="bg-slate-950/70 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Tenant</th>
                <th className="px-5 py-4 font-semibold">Plan</th>
                <th className="px-5 py-4 font-semibold">Members</th>
                <th className="px-5 py-4 font-semibold">Created</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {visibleTenants.map((tenant) => (
                <tr key={tenant.id} className="transition hover:bg-slate-800/40">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 font-semibold text-blue-400">
                        {tenant.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{tenant.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {tenant.email}
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                          {tenant.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-slate-300">
                      {tenant.plan}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-300">
                    {tenant.members}
                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    {tenant.createdAt}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1.5 text-xs font-medium ${
                        tenant.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-rose-500/10 text-rose-400"
                      }`}
                    >
                      {tenant.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        title="Edit tenant"
                        aria-label={`Edit ${tenant.name}`}
                        onClick={() => openEditModal(tenant)}
                        className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:border-blue-500 hover:text-blue-400"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        title={
                          tenant.status === "Active"
                            ? "Deactivate tenant"
                            : "Activate tenant"
                        }
                        aria-label={`${
                          tenant.status === "Active" ? "Deactivate" : "Activate"
                        } ${tenant.name}`}
                        onClick={() => toggleTenantStatus(tenant.id)}
                        className={`rounded-lg border border-slate-700 p-2 transition ${
                          tenant.status === "Active"
                            ? "text-rose-400 hover:border-rose-500"
                            : "text-emerald-400 hover:border-emerald-500"
                        }`}
                      >
                        <Power size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {visibleTenants.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Building2
                      size={32}
                      className="mx-auto mb-3 text-slate-600"
                    />
                    <p className="font-medium text-slate-300">
                      No tenants found
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or filters.
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
            {filteredTenants.length === 0
              ? 0
              : (safePage - 1) * pageSize + 1}
            {" "}to{" "}
            {Math.min(safePage * pageSize, filteredTenants.length)}
            {" "}of {filteredTenants.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage(safePage - 1)}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-2 text-sm text-slate-400">
              Page {safePage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage(safePage + 1)}
              className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
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
            aria-labelledby="tenant-modal-title"
            className="my-auto w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-2xl sm:p-7"
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2
                  id="tenant-modal-title"
                  className="text-xl font-bold text-white"
                >
                  {editingId ? "Edit Tenant" : "Add New Tenant"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Enter the tenant details below.
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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="tenant-name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Tenant name
                </label>
                <input
                  id="tenant-name"
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Acme Corporation"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="tenant-email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Admin email
                </label>
                <input
                  id="tenant-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="admin@company.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="tenant-plan"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Subscription plan
                </label>
                <select
                  id="tenant-plan"
                  value={form.plan}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      plan: event.target.value as Tenant["plan"],
                    })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                >
                  <option value="Free">Free</option>
                  <option value="Pro">Pro</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="tenant-members"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Number of members
                </label>
                <input
                  id="tenant-members"
                  type="number"
                  min={1}
                  required
                  value={form.members}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      members: Math.max(1, Number(event.target.value)),
                    })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
                />
              </div>

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
                  {editingId ? "Save Changes" : "Create Tenant"}
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
