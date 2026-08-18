import {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import type { TimeCapsule } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../hooks/useNotifications";

type SealInput = {
  recipientId: string;
  message: string;
  photoIds: string[];
  openDate: string;
};

type CapsuleContextValue = {
  capsules: TimeCapsule[];
  seal: (input: SealInput) => Promise<void>;
  open: (id: string) => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const CapsuleContext = createContext<CapsuleContextValue | null>(null);

const CHECK_INTERVAL_MS = 15000;

export function CapsuleProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const { notify } = useNotifications();
  const [sent, setSent] = useState<TimeCapsule[]>([]);
  const [received, setReceived] = useState<TimeCapsule[]>([]);

  const capsules = useMemo(() => {
    const byId = new Map<string, TimeCapsule>();
    [...sent, ...received].forEach((c) => byId.set(c.id, c));
    return [...byId.values()].sort((a, b) => b.sealedAt.localeCompare(a.sealedAt));
  }, [sent, received]);

  const capsulesRef = useRef(capsules);
  useEffect(() => {
    capsulesRef.current = capsules;
  }, [capsules]);

  useEffect(() => {
    if (!currentUser) return;
    const unsubSent = onSnapshot(
      query(collection(db, "capsules"), where("senderId", "==", currentUser.id)),
      (snap) =>
        setSent(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TimeCapsule)),
    );
    const unsubReceived = onSnapshot(
      query(collection(db, "capsules"), where("recipientId", "==", currentUser.id)),
      (snap) =>
        setReceived(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as TimeCapsule)),
    );
    return () => {
      unsubSent();
      unsubReceived();
    };
  }, [currentUser]);

  useEffect(() => {
    function checkArrivals() {
      const now = Date.now();
      const due = capsulesRef.current.filter(
        (c) => c.status === "sealed" && new Date(c.openDate).getTime() <= now,
      );
      due.forEach(async (c) => {
        await updateDoc(doc(db, "capsules", c.id), { status: "arrived" });
        notify({
          userId: c.recipientId,
          type: "capsule_arrived",
          title: "타임캡슐이 도착했어요",
          message: "개봉 가능한 타임캡슐이 도착했어요. 지금 열어보세요!",
          linkTo: "/capsule",
        });
      });
    }
    checkArrivals();
    const interval = setInterval(checkArrivals, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [notify]);

  async function seal(input: SealInput) {
    if (!currentUser) return;
    await addDoc(collection(db, "capsules"), {
      senderId: currentUser.id,
      recipientId: input.recipientId,
      message: input.message,
      photoIds: input.photoIds,
      sealedAt: new Date().toISOString(),
      openDate: input.openDate,
      status: "sealed",
    });
  }

  async function open(id: string) {
    const capsule = capsulesRef.current.find((c) => c.id === id);
    if (!capsule || capsule.status !== "arrived") return;
    await updateDoc(doc(db, "capsules", id), { status: "opened" });
  }

  return (
    <CapsuleContext.Provider value={{ capsules, seal, open }}>
      {children}
    </CapsuleContext.Provider>
  );
}
