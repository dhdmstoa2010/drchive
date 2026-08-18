import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import type { AppNotification, NotificationType } from "../../types";
import { useAuth } from "../../hooks/useAuth";

type NotifyInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  linkTo?: string;
};

type NotificationContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  notify: (input: NotifyInput) => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.id),
    );
    return onSnapshot(q, (snap) => {
      const items = snap.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as AppNotification,
      );
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setNotifications(items);
    });
  }, [currentUser]);

  useEffect(() => {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  async function notify(input: NotifyInput) {
    await addDoc(collection(db, "notifications"), {
      ...input,
      read: false,
      createdAt: new Date().toISOString(),
    });
    try {
      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "granted"
      ) {
        new Notification(input.title, { body: input.message });
      }
    } catch {
      // browser notification isn't critical, in-app list still has it
    }
  }

  async function markRead(id: string) {
    await updateDoc(doc(db, "notifications", id), { read: true });
  }

  async function markAllRead() {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;
    const batch = writeBatch(db);
    unread.forEach((n) => batch.update(doc(db, "notifications", n.id), { read: true }));
    await batch.commit();
  }

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, notify, markRead, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
