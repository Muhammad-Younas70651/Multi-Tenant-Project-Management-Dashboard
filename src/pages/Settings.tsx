
import { useEffect, useState, type FormEvent } from "react";
import {
  Settings as SettingsIcon,
  UserRound,
  Bell,
  Palette,
  ShieldCheck,
  Save,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

interface SettingsData {
  fullName: string;
  email: string;
  jobTitle: string;
  organization: string;
  emailNotifications: boolean;
  taskNotifications: boolean;
  projectNotifications: boolean;
  theme: "Dark" | "Light" | "System";
  language: string;
  timezone: string;
}

const STORAGE_KEY = "projectflow_settings";

const defaultSettings: SettingsData = {
  fullName: "Muhammad Younas",
  email: "younas@example.com",
  jobTitle: "Frontend Developer",
  organization: "ProjectFlow",
  emailNotifications: true,
  taskNotifications: true,
  projectNotifications: false,
  theme: "Dark",
  language: "English",
  timezone: "Asia/Karachi",
};

export default function Settings() {
  const [settings, setSettings] = useState<SettingsData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? { ...defaultSettings, ...JSON.parse(saved) as Partial<SettingsData> }
        : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (!savedMessage) return;

    const timeoutId = window.setTimeout(() => setSavedMessage(false), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [savedMessage]);

  function updateSetting<K extends keyof SettingsData>(
    key: K,
    value: SettingsData[K],
  ) {
    setSettings((current) => ({ ...current, [key]: value }));
    setSavedMessage(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSavedMessage(true);
  }

  function resetSettings() {
    const confirmed = window.confirm(
      "Reset all settings to their default values?",
    );

    if (confirmed) {
      setSettings(defaultSettings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
      setSavedMessage(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-400">Preferences</p>
        <h1 className="mt-1 flex items-center gap-3 text-2xl font-bold text-white sm:text-3xl">
          <SettingsIcon size={27} />
          Settings
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Manage your profile, notifications, and dashboard preferences.
        </p>
      </div>

      {savedMessage && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300"
        >
          <CheckCircle2 size={19} />
          Your settings have been saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <SectionHeading
            icon={<UserRound size={20} />}
            title="Profile Information"
            description="Update the information associated with your profile."
          />

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
            <div>
              <label htmlFor="full-name" className="mb-2 block text-sm font-medium text-slate-300">
                Full name
              </label>
              <input
                id="full-name"
                required
                value={settings.fullName}
                onChange={(event) => updateSetting("fullName", event.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="settings-email" className="mb-2 block text-sm font-medium text-slate-300">
                Email address
              </label>
              <input
                id="settings-email"
                required
                type="email"
                value={settings.email}
                onChange={(event) => updateSetting("email", event.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="job-title" className="mb-2 block text-sm font-medium text-slate-300">
                Job title
              </label>
              <input
                id="job-title"
                value={settings.jobTitle}
                onChange={(event) => updateSetting("jobTitle", event.target.value)}
                placeholder="Frontend Developer"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="organization" className="mb-2 block text-sm font-medium text-slate-300">
                Organization
              </label>
              <input
                id="organization"
                value={settings.organization}
                onChange={(event) => updateSetting("organization", event.target.value)}
                placeholder="Organization name"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <SectionHeading
            icon={<Bell size={20} />}
            title="Notifications"
            description="Choose which notifications you want to receive."
          />

          <div className="divide-y divide-slate-800 px-5">
            <ToggleSetting
              title="Email notifications"
              description="Receive important account updates by email."
              checked={settings.emailNotifications}
              onChange={(value) => updateSetting("emailNotifications", value)}
            />
            <ToggleSetting
              title="Task notifications"
              description="Receive updates when tasks are assigned or changed."
              checked={settings.taskNotifications}
              onChange={(value) => updateSetting("taskNotifications", value)}
            />
            <ToggleSetting
              title="Project notifications"
              description="Receive updates about project activity."
              checked={settings.projectNotifications}
              onChange={(value) => updateSetting("projectNotifications", value)}
            />
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <SectionHeading
            icon={<Palette size={20} />}
            title="Appearance & Preferences"
            description="Customize how the dashboard is configured for you."
          />

          <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
            <div>
              <label htmlFor="theme" className="mb-2 block text-sm font-medium text-slate-300">
                Theme preference
              </label>
              <select
                id="theme"
                value={settings.theme}
                onChange={(event) =>
                  updateSetting("theme", event.target.value as SettingsData["theme"])
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="Dark">Dark</option>
                <option value="Light">Light</option>
                <option value="System">System default</option>
              </select>
              <p className="mt-2 text-xs text-slate-500">
                This saves your preference; it does not switch the app theme yet.
              </p>
            </div>

            <div>
              <label htmlFor="language" className="mb-2 block text-sm font-medium text-slate-300">
                Language
              </label>
              <select
                id="language"
                value={settings.language}
                onChange={(event) => updateSetting("language", event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="English">English</option>
                <option value="Urdu">Urdu</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="timezone" className="mb-2 block text-sm font-medium text-slate-300">
                Time zone
              </label>
              <select
                id="timezone"
                value={settings.timezone}
                onChange={(event) => updateSetting("timezone", event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="Asia/Karachi">Pakistan Standard Time (Asia/Karachi)</option>
                <option value="UTC">Coordinated Universal Time (UTC)</option>
                <option value="Europe/London">London (Europe/London)</option>
                <option value="America/New_York">New York (America/New_York)</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 shrink-0 text-blue-400" size={22} />
            <div>
              <h2 className="font-semibold text-white">Security note</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                These settings are stored in this browser. Password changes,
                session controls, and security enforcement require a backend
                authentication service.
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
          >
            <RotateCcw size={17} />
            Reset defaults
          </button>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Save size={18} />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

function SectionHeading({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-slate-800 p-5">
      <span className="rounded-xl bg-blue-500/10 p-2.5 text-blue-400">
        {icon}
      </span>
      <div>
        <h2 className="font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function ToggleSetting({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-all ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
