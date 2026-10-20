
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Menu,
  LogOut,
  ChevronDown,
  // UserRound,
  Settings,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const roleLabel =
    user?.role === "superadmin"
      ? "Superadmin"
      : user?.role === "tenant-admin"
        ? "Tenant Admin"
        : "Team Member";

  const initials =
    user?.name
      ?.split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const goToSettings = () => {
    setProfileOpen(false);
    navigate("/settings");
  };

  const handleLogout = () => {
    setProfileOpen(false);
    setNotificationsOpen(false);
    logout();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950">
      <div className="flex h-20 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            aria-controls="app-sidebar"
            className="rounded-xl border border-slate-700 p-2 text-slate-300 transition hover:bg-slate-800 lg:hidden"
          >
            <Menu size={21} />
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="min-w-0 text-left"
          >
            <span className="hidden text-xs text-slate-500 sm:block">
              Workspace
            </span>
            <span className="mt-1 block truncate text-sm font-semibold text-white sm:text-base">
              Project Management
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              aria-label="Toggle notifications"
              aria-expanded={notificationsOpen}
              onClick={() => {
                setNotificationsOpen((open) => !open);
                setProfileOpen(false);
              }}
              className="relative rounded-xl border border-slate-800 p-2.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <Bell size={19} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-14 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl sm:w-80">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">
                    Notifications
                  </h3>

                  <button
                    type="button"
                    aria-label="Close notifications"
                    onClick={() => setNotificationsOpen(false)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                  >
                    <X size={17} />
                  </button>
                </div>

                <p className="mt-4 text-sm text-slate-400">
                  You have no new notifications.
                </p>
              </div>
            )}
          </div>

          <div className="hidden h-8 w-px bg-slate-800 sm:block" />

          {/* Profile menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((open) => !open);
                setNotificationsOpen(false);
              }}
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-800 sm:gap-3"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {initials}
              </span>

              <span className="hidden min-w-0 text-left md:block">
                <span className="block max-w-40 truncate text-sm font-semibold text-white">
                  {user?.name || "Demo User"}
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                  {roleLabel}
                </span>
              </span>

              <ChevronDown
                size={16}
                className="hidden text-slate-500 md:block"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-14 z-50 w-56 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-xl">
                <div className="border-b border-slate-800 px-3 py-3">
                  <p className="truncate text-sm font-semibold text-white">
                    {user?.name || "Demo User"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {roleLabel}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={goToSettings}
                  className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Settings size={17} />
                  Settings
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-950"
                >
                  <LogOut size={17} />
                  Log out
                </button>
              </div>
            )}
          </div>

          {/* Quick logout */}
          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            aria-label="Log out"
            className="rounded-xl border border-slate-800 p-2.5 text-slate-400 transition hover:border-red-900 hover:bg-red-950 hover:text-red-400"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
