import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Report, ReportTargetType } from "../../types";
import { useAuth } from "../../hooks/useAuth";

type ReportInput = {
  targetType: ReportTargetType;
  targetId: string;
  targetOwnerId?: string;
  reason: string;
  detail?: string;
};

type ReportContextValue = {
  myReports: Report[];
  blockedUserIds: string[];
  submitReport: (input: ReportInput) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  isBlocked: (userId?: string) => boolean;
};

// eslint-disable-next-line react-refresh/only-export-components
export const ReportContext = createContext<ReportContextValue | null>(null);

export function ReportProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "reports"),
      where("reporterId", "==", currentUser.id),
    );
    return onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Report);
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      setMyReports(items);
    });
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    return onSnapshot(doc(db, "blocks", currentUser.id), (snap) => {
      setBlockedUserIds((snap.data()?.blockedIds as string[] | undefined) ?? []);
    });
  }, [currentUser]);

  async function submitReport(input: ReportInput) {
    if (!currentUser) return;
    await addDoc(collection(db, "reports"), {
      reporterId: currentUser.id,
      targetType: input.targetType,
      targetId: input.targetId,
      targetOwnerId: input.targetOwnerId ?? null,
      reason: input.reason,
      detail: input.detail ?? null,
      createdAt: new Date().toISOString(),
    });
  }

  async function blockUser(userId: string) {
    if (!currentUser) return;
    await setDoc(
      doc(db, "blocks", currentUser.id),
      { blockedIds: arrayUnion(userId) },
      { merge: true },
    );
  }

  async function unblockUser(userId: string) {
    if (!currentUser) return;
    await setDoc(
      doc(db, "blocks", currentUser.id),
      { blockedIds: arrayRemove(userId) },
      { merge: true },
    );
  }

  function isBlocked(userId?: string) {
    if (!userId) return false;
    return blockedUserIds.includes(userId);
  }

  return (
    <ReportContext.Provider
      value={{
        myReports,
        blockedUserIds,
        submitReport,
        blockUser,
        unblockUser,
        isBlocked,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}
