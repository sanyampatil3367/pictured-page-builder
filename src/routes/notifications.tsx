import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Check,
  CheckCheck,
  ChevronRight,
  CircleAlert,
  Info,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

type NotificationType =
  | "maintenance"
  | "verification"
  | "ai"
  | "announcement";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  unread: boolean;
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    title: "Maintenance update",
    message:
      "Your report “Ceiling fan not working” has been assigned to an electrician and is now in progress.",
    time: "12 min ago",
    type: "maintenance",
    unread: true,
  },
  {
    id: "n2",
    title: "Report verified",
    message:
      "Your report “Broken classroom chair” has been verified. You earned +10 campus impact points.",
    time: "2 hours ago",
    type: "verification",
    unread: true,
  },
  {
    id: "n3",
    title: "AI insight",
    message:
      "VYRA detected higher-than-usual energy usage in Block A Room 204 during the previous evening period.",
    time: "Yesterday",
    type: "ai",
    unread: true,
  },
  {
    id: "n4",
    title: "Campus announcement",
    message:
      "The Science Block electrical maintenance window is scheduled for tomorrow from 9:00 AM to 11:00 AM.",
    time: "Yesterday",
    type: "announcement",
    unread: false,
  },
  {
    id: "n5",
    title: "Maintenance completed",
    message:
      "The exposed electrical wire reported in Lab 302 has been repaired and marked completed.",
    time: "Oct 16",
    type: "maintenance",
    unread: false,
  },
];

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "maintenance":
      return <Wrench size={17} />;

    case "verification":
      return <CheckCheck size={17} />;

    case "ai":
      return <Sparkles size={17} />;

    case "announcement":
      return <Info size={17} />;

    default:
      return <Bell size={17} />;
  }
}

function getIconClasses(type: NotificationType) {
  switch (type) {
    case "maintenance":
      return "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300";

    case "verification":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300";

    case "ai":
      return "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300";

    case "announcement":
      return "border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-300";

    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );

  const unreadCount = useMemo(
    () => notifications.filter((notification) => notification.unread).length,
    [notifications]
  );

  function markAsRead(id: string) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  }

  function removeNotification(id: string) {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  }

  return (
    <div className="min-h-full px-4 py-5 text-foreground md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px] space-y-5">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/75 p-6 shadow-xl backdrop-blur-2xl">
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-yellow-300/15 blur-3xl dark:bg-yellow-300/10" />
          <div className="pointer-events-none absolute -bottom-32 right-10 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl dark:bg-amber-400/[0.06]" />

          <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-yellow-600 dark:text-yellow-300">
                <Bell size={14} />
                Campus Updates
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Notifications
                </h1>

                {unreadCount > 0 && (
                  <span className="rounded-full border border-yellow-400/25 bg-yellow-300/15 px-2.5 py-1 text-[10px] font-semibold text-yellow-700 dark:text-yellow-200">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Stay updated on your maintenance reports, campus activity, AI
                insights, and important announcements.
              </p>
            </div>

            <button
              type="button"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-4 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
            >
              <CheckCheck size={15} />
              Mark all as read
            </button>
          </div>
        </section>

        {/* Notification list */}
        {notifications.length === 0 ? (
          <EmptyState />
        ) : (
          <section className="space-y-3">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onRead={() => markAsRead(notification.id)}
                onRemove={() => removeNotification(notification.id)}
              />
            ))}
          </section>
        )}

        {/* Notification explanation */}
        <section className="rounded-3xl border border-yellow-400/15 bg-yellow-300/[0.045] p-5 shadow-lg backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-yellow-400/15 bg-yellow-300/10 text-yellow-700 dark:text-yellow-300">
              <Bell size={16} />
            </div>

            <div>
              <p className="text-sm font-semibold">VYRA notifications</p>

              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Notifications will eventually be generated from the VYRA
                backend when maintenance status, verification, sustainability,
                energy or campus announcements change.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function NotificationCard({
  notification,
  onRead,
  onRemove,
}: {
  notification: NotificationItem;
  onRead: () => void;
  onRemove: () => void;
}) {
  return (
    <article
      className={`group rounded-3xl border p-4 shadow-lg backdrop-blur-xl transition md:p-5 ${
        notification.unread
          ? "border-yellow-400/20 bg-card"
          : "border-border bg-card/65"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${getIconClasses(
            notification.type
          )}`}
        >
          {getNotificationIcon(notification.type)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {notification.unread && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-yellow-400 shadow-[0_0_9px_rgba(250,204,21,0.7)]" />
                )}

                <h2 className="text-sm font-semibold text-foreground">
                  {notification.title}
                </h2>
              </div>

              <p className="mt-2 max-w-3xl text-xs leading-5 text-muted-foreground">
                {notification.message}
              </p>
            </div>

            <span className="shrink-0 text-[10px] text-muted-foreground/70">
              {notification.time}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {notification.unread ? (
              <button
                type="button"
                onClick={onRead}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 text-[10px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <Check size={13} />
                Mark as read
              </button>
            ) : (
              <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 text-[10px] text-muted-foreground/70">
                <Check size={13} />
                Read
              </span>
            )}

            <button
              type="button"
              onClick={onRemove}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[10px] font-medium text-muted-foreground/60 transition hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300"
            >
              <X size={13} />
              Remove
            </button>

            <button
              type="button"
              className="ml-auto inline-flex h-8 items-center gap-1 text-[10px] font-medium text-muted-foreground/60 transition hover:text-foreground"
            >
              View details
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <section className="rounded-3xl border border-border bg-card/70 p-12 text-center shadow-lg backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted/50 text-muted-foreground">
        <Bell size={23} />
      </div>

      <h2 className="mt-5 text-sm font-semibold">You're all caught up</h2>

      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-muted-foreground">
        New maintenance updates, report verification results and campus
        announcements will appear here.
      </p>

      <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.05] px-3 py-2 text-[10px] text-emerald-600 dark:text-emerald-300">
        <CircleAlert size={13} />
        No unread notifications
      </div>
    </section>
  );
}