
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FolderKanban,
  MoreHorizontal,
  Plus,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  {
    title: "Total Projects",
    value: "24",
    change: "+12% this month",
    icon: FolderKanban,
    iconStyle: "bg-blue-500/10 text-blue-400",
  },
  {
    title: "Active Members",
    value: "18",
    change: "+4 new members",
    icon: Users,
    iconStyle: "bg-violet-500/10 text-violet-400",
  },
  {
    title: "Completed Tasks",
    value: "156",
    change: "+18 this week",
    icon: CheckCircle2,
    iconStyle: "bg-emerald-500/10 text-emerald-400",
  },
  {
    title: "Overdue Tasks",
    value: "7",
    change: "Needs attention",
    icon: Clock3,
    iconStyle: "bg-amber-500/10 text-amber-400",
  },
];

const projects = [
  {
    name: "Website Redesign",
    description: "Redesign the company website",
    team: "Design Team",
    progress: 78,
    status: "In Progress",
    statusStyle: "bg-blue-500/10 text-blue-400",
  },
  {
    name: "Mobile Application",
    description: "Build the mobile application",
    team: "Development",
    progress: 52,
    status: "In Progress",
    statusStyle: "bg-blue-500/10 text-blue-400",
  },
  {
    name: "Marketing Campaign",
    description: "Prepare the upcoming campaign",
    team: "Marketing",
    progress: 100,
    status: "Completed",
    statusStyle: "bg-emerald-500/10 text-emerald-400",
  },
  {
    name: "Admin Dashboard",
    description: "Improve dashboard functionality",
    team: "Development",
    progress: 25,
    status: "At Risk",
    statusStyle: "bg-amber-500/10 text-amber-400",
  },
];

const activities = [
  {
    initials: "AY",
    name: "Ali Younas",
    action: "completed a task in",
    target: "Website Redesign",
    time: "10 minutes ago",
    color: "bg-blue-500",
  },
  {
    initials: "SK",
    name: "Sara Khan",
    action: "created a project",
    target: "Mobile Application",
    time: "35 minutes ago",
    color: "bg-violet-500",
  },
  {
    initials: "AM",
    name: "Ahmed Malik",
    action: "updated a task in",
    target: "Admin Dashboard",
    time: "1 hour ago",
    color: "bg-emerald-500",
  },
  {
    initials: "FA",
    name: "Fatima Ali",
    action: "joined the team",
    target: "",
    time: "2 hours ago",
    color: "bg-amber-500",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-slate-400">Overview</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Welcome back! Here is what is happening with your workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/projects")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          <Plus size={18} />
          Create Project
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{stat.title}</p>
                <div className={`rounded-xl p-3 ${stat.iconStyle}`}>
                  <Icon size={20} />
                </div>
              </div>

              <h2 className="mt-5 text-3xl font-bold text-white">
                {stat.value}
              </h2>

              <p className="mt-2 text-xs text-slate-400">
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Projects and activity */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 p-5">
            <div>
              <h2 className="font-semibold text-white">Recent Projects</h2>
              <p className="mt-1 text-sm text-slate-400">
                Track your team's project progress
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/projects")}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              View all
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-5 py-4 font-medium">Project</th>
                  <th className="px-5 py-4 font-medium">Team</th>
                  <th className="px-5 py-4 font-medium">Progress</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-800">
                {projects.map((project) => (
                  <tr
                    key={project.name}
                    className="hover:bg-slate-800/50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">
                        {project.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {project.description}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {project.team}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-700">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">
                          {project.progress}%
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${project.statusStyle}`}
                      >
                        {project.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        aria-label={`Open ${project.name}`}
                        onClick={() => navigate("/projects")}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-700 hover:text-white"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent activity */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 p-5">
            <h2 className="font-semibold text-white">Recent Activity</h2>
            <p className="mt-1 text-sm text-slate-400">
              Latest team updates
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            {activities.map((activity) => (
              <div
                key={`${activity.name}-${activity.time}`}
                className="flex gap-3 p-5"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${activity.color}`}
                >
                  {activity.initials}
                </div>

                <div className="min-w-0">
                  <p className="text-sm leading-6 text-slate-300">
                    <span className="font-semibold text-white">
                      {activity.name}
                    </span>{" "}
                    {activity.action}{" "}
                    {activity.target && (
                      <span className="font-medium text-blue-400">
                        {activity.target}
                      </span>
                    )}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 p-4">
            <button
              type="button"
              onClick={() => navigate("/tasks")}
              className="w-full rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              View all activity
            </button>
          </div>
        </section>
      </div>

      {/* Bottom information */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Keep your projects moving
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Review overdue tasks, update project progress, and keep your
              team informed about upcoming deadlines.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/tasks")}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Review Tasks
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
}
