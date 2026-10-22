import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Check,
  ChevronRight,
  Globe,
  Lock,
  Moon,
  Palette,
  Shield,
  Sun,
  Volume2,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

type SettingsState = {
  notifications: boolean;
  maintenanceUpdates: boolean;
  sustainabilityUpdates: boolean;
  aiSuggestions: boolean;
  soundEffects: boolean;
  language: string;
  theme: "system" | "light" | "dark";
};

const DEFAULT_SETTINGS: SettingsState = {
  notifications: true,
  maintenanceUpdates: true,
  sustainabilityUpdates: true,
  aiSuggestions: true,
  soundEffects: true,
  language: "English",
  theme: "system",
};

const SETTINGS_KEY = "vyra-settings";

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full p-[3px] transition-all duration-300 ease-out ${
        checked
          ? "bg-[#f5bd24] shadow-[inset_0_1px_2px_rgba(120,80,0,0.12),0_3px_10px_rgba(245,189,36,0.16)]"
          : "bg-[#deddd9] shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)] dark:bg-white/15"
      }`}
    >
      <span
        className={`block h-[22px] w-[22px] rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.14)] transition-transform duration-300 ease-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Bell;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[26px] border border-black/[0.06] bg-white/55 shadow-[0_18px_60px_rgba(0,0,0,0.05)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-white/[0.04]">
      <div className="flex items-center gap-4 border-b border-black/[0.05] px-6 py-5 dark:border-white/[0.06]">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5bd24]/15">
          <Icon className="h-5 w-5 text-[#d49d00]" />
        </div>

        <div>
          <h2 className="text-[15px] font-semibold text-[#292724] dark:text-white">
            {title}
          </h2>

          <p className="mt-0.5 text-xs text-[#77736c] dark:text-white/45">
            {description}
          </p>
        </div>
      </div>

      <div>{children}</div>
    </section>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#35322e] dark:text-white/90">
          {title}
        </p>

        <p className="mt-1 max-w-xl text-xs leading-5 text-[#807b73] dark:text-white/45">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}

function SettingsPage() {
  const [settings, setSettings] =
    useState<SettingsState>(DEFAULT_SETTINGS);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);

      if (stored) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(stored),
        });
      }
    } catch {
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);

  function updateSetting<K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K],
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  }

  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2200);
  }

  return (
    <main className="relative min-h-[calc(100vh-96px)] overflow-hidden px-5 pb-10 pt-6 md:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-yellow-200/30 blur-[100px] dark:bg-yellow-500/10" />

        <div className="absolute right-0 top-24 h-96 w-96 rounded-full bg-amber-100/35 blur-[120px] dark:bg-amber-500/10" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-orange-100/25 blur-[120px] dark:bg-orange-500/10" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-[#a28a45] dark:text-yellow-400/70">
              VYRA Preferences
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-[#272521] dark:text-white md:text-4xl">
              Settings
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#77736c] dark:text-white/45">
              Control how VYRA communicates with you and how your campus
              experience behaves.
            </p>
          </div>

          <button
            type="button"
            onClick={saveSettings}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#f5bd24] px-5 text-sm font-semibold text-[#30270f] shadow-[0_10px_30px_rgba(245,189,36,0.22)] transition-all hover:-translate-y-0.5 hover:bg-[#f7c62e] active:translate-y-0"
          >
            {saved ? (
              <>
                <Check className="h-4 w-4" />
                Saved
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>

        <div className="space-y-5">
          {/* Notifications */}
          <Section
            icon={Bell}
            title="Notifications"
            description="Choose which VYRA updates you want to receive."
          >
            <SettingRow
              title="Notifications"
              description="Allow VYRA to send important updates about your campus activity."
            >
              <Toggle
                checked={settings.notifications}
                onChange={(value) =>
                  updateSetting("notifications", value)
                }
              />
            </SettingRow>

            <div className="mx-6 border-t border-black/[0.05] dark:border-white/[0.06]" />

            <SettingRow
              title="Maintenance updates"
              description="Get notified when an issue you reported changes status."
            >
              <Toggle
                checked={settings.maintenanceUpdates}
                onChange={(value) =>
                  updateSetting("maintenanceUpdates", value)
                }
              />
            </SettingRow>

            <div className="mx-6 border-t border-black/[0.05] dark:border-white/[0.06]" />

            <SettingRow
              title="Sustainability updates"
              description="Receive updates about campus sustainability activities and impact."
            >
              <Toggle
                checked={settings.sustainabilityUpdates}
                onChange={(value) =>
                  updateSetting("sustainabilityUpdates", value)
                }
              />
            </SettingRow>

            <div className="mx-6 border-t border-black/[0.05] dark:border-white/[0.06]" />

            <SettingRow
              title="AI suggestions"
              description="Allow VYRA to provide contextual recommendations and helpful suggestions."
            >
              <Toggle
                checked={settings.aiSuggestions}
                onChange={(value) =>
                  updateSetting("aiSuggestions", value)
                }
              />
            </SettingRow>

            <div className="mx-6 border-t border-black/[0.05] dark:border-white/[0.06]" />

            <SettingRow
              title="Sound effects"
              description="Use subtle sounds for important interactions and notifications."
            >
              <Toggle
                checked={settings.soundEffects}
                onChange={(value) =>
                  updateSetting("soundEffects", value)
                }
              />
            </SettingRow>
          </Section>

          {/* Appearance */}
          <Section
            icon={Palette}
            title="Appearance"
            description="Personalize how VYRA looks on your device."
          >
            <SettingRow
              title="Theme"
              description="Choose whether VYRA follows your device or uses a fixed appearance."
            >
              <div className="flex items-center gap-1 rounded-2xl border border-black/[0.06] bg-black/[0.025] p-1 dark:border-white/[0.08] dark:bg-white/[0.04]">
                {[
                  {
                    value: "system" as const,
                    label: "System",
                    icon: Palette,
                  },
                  {
                    value: "light" as const,
                    label: "Light",
                    icon: Sun,
                  },
                  {
                    value: "dark" as const,
                    label: "Dark",
                    icon: Moon,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const active = settings.theme === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        updateSetting("theme", item.value)
                      }
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                        active
                          ? "bg-white text-[#302e2a] shadow-sm dark:bg-white/10 dark:text-white"
                          : "text-[#77736c] hover:bg-white/50 dark:text-white/45 dark:hover:bg-white/[0.05]"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />

                      <span className="hidden sm:inline">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </SettingRow>

            <div className="mx-6 border-t border-black/[0.05] dark:border-white/[0.06]" />

            <SettingRow
              title="Language"
              description="Choose the language used by VYRA wherever multilingual support is available."
            >
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#99948b]" />

                <select
                  value={settings.language}
                  onChange={(event) =>
                    updateSetting("language", event.target.value)
                  }
                  className="h-10 appearance-none rounded-xl border border-black/[0.07] bg-white/70 pl-9 pr-9 text-sm text-[#4d4942] outline-none transition focus:border-[#f5bd24] dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-white"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Kannada</option>
                </select>

                <ChevronRight className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-[#99948b]" />
              </div>
            </SettingRow>
          </Section>

          {/* Privacy & Security */}
          <Section
            icon={Shield}
            title="Privacy & Security"
            description="Your account permissions and campus access are controlled securely."
          >
            <SettingRow
              title="College account protection"
              description="Your college, student ID, role and membership are controlled by your college database."
            >
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Protected
              </div>
            </SettingRow>

            <div className="mx-6 border-t border-black/[0.05] dark:border-white/[0.06]" />

            <SettingRow
              title="Role permissions"
              description="Your access to student, worker and administrator features is determined by your verified role."
            >
              <Lock className="h-5 w-5 text-[#8b867e]" />
            </SettingRow>

            <div className="mx-6 border-t border-black/[0.05] dark:border-white/[0.06]" />

            <SettingRow
              title="Account data"
              description="Profile information is linked to your college account and will be connected to the VYRA database."
            >
              <span className="text-xs font-medium text-[#8b867e]">
                College managed
              </span>
            </SettingRow>
          </Section>

          {/* Accessibility */}
          <Section
            icon={Volume2}
            title="Accessibility"
            description="VYRA is designed to remain usable across different needs and devices."
          >
            <SettingRow
              title="Voice assistance"
              description="Voice-based interaction can be used with the VYRA AI assistant and supported worker workflows."
            >
              <span className="rounded-full bg-[#f5bd24]/10 px-3 py-1.5 text-xs font-medium text-[#9b7700] dark:text-yellow-400">
                Available
              </span>
            </SettingRow>

            <div className="mx-6 border-t border-black/[0.05] dark:border-white/[0.06]" />

            <SettingRow
              title="High contrast"
              description="Additional accessibility controls can be enabled as VYRA's accessibility system expands."
            >
              <span className="text-xs font-medium text-[#8b867e]">
                Coming soon
              </span>
            </SettingRow>
          </Section>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-[#99948b] dark:text-white/35">
          <Lock className="h-3.5 w-3.5" />
          Your account-controlled information cannot be changed from
          Settings.
        </div>
      </div>
    </main>
  );
}