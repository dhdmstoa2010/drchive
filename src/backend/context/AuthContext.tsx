import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import type { User } from "../../types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SignupInput = {
  name: string;
  email: string;
  password: string;
  grade: number;
  className: number;
};

type AuthResult = { ok: true } | { ok: false; error: string };

type AuthContextValue = {
  users: User[];
  currentUser: User | null;
  authLoading: boolean;
  signup: (input: SignupInput) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  withdraw: () => Promise<AuthResult>;
  updateProfile: (
    patch: Partial<Pick<User, "name" | "grade" | "className">>,
  ) => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

function authErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "이미 가입된 이메일이에요.";
    case "auth/invalid-email":
      return "학교 이메일 형식이 올바르지 않아요.";
    case "auth/weak-password":
      return "비밀번호는 6자 이상이어야 해요.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "이메일 또는 비밀번호가 올바르지 않아요.";
    case "auth/too-many-requests":
      return "시도가 너무 많아요. 잠시 후 다시 시도해주세요.";
    case "auth/requires-recent-login":
      return "보안을 위해 재로그인이 필요해요. 로그아웃 후 다시 로그인하고 시도해주세요.";
    default:
      return "문제가 발생했어요. 잠시 후 다시 시도해주세요.";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    return onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as User));
    });
  }, [currentUser]);

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      unsubProfile?.();
      if (!firebaseUser) {
        setCurrentUser(null);
        setAuthLoading(false);
        return;
      }
      // Listen (not one-shot get) so the just-created profile doc shows up
      // even if this fires before signup()'s setDoc has finished writing it.
      unsubProfile = onSnapshot(doc(db, "users", firebaseUser.uid), (snap) => {
        setCurrentUser(
          snap.exists() ? ({ id: firebaseUser.uid, ...snap.data() } as User) : null,
        );
        setAuthLoading(false);
      });
    });

    return () => {
      unsubProfile?.();
      unsubAuth();
    };
  }, []);

  async function signup(input: SignupInput): Promise<AuthResult> {
    const email = input.email.trim().toLowerCase();
    const name = input.name.trim();
    if (!name) return { ok: false, error: "이름을 입력해주세요." };
    if (!EMAIL_RE.test(email)) {
      return { ok: false, error: "학교 이메일 형식이 올바르지 않아요." };
    }
    if (input.password.length < 6) {
      return { ok: false, error: "비밀번호는 6자 이상이어야 해요." };
    }

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email,
        input.password,
      );
      const profile: Omit<User, "id"> = {
        email,
        name,
        grade: input.grade,
        className: input.className,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", credential.user.uid), profile);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: authErrorMessage((err as { code?: string }).code ?? "") };
    }
  }

  async function login(email: string, password: string): Promise<AuthResult> {
    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: authErrorMessage((err as { code?: string }).code ?? "") };
    }
  }

  async function logout() {
    await signOut(auth);
  }

  async function withdraw(): Promise<AuthResult> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return { ok: false, error: "로그인이 필요해요." };

    const uid = firebaseUser.uid;
    // Firestore's delete rule requires an authenticated request, so the
    // profile doc has to go before the auth account. If deleteUser() then
    // fails (e.g. session isn't "recent" enough), restore the profile so
    // the account isn't left orphaned — deleted profile, but email still
    // registered and impossible to sign up again with.
    const profileSnap = await getDoc(doc(db, "users", uid));
    const profileData = profileSnap.data();

    await deleteDoc(doc(db, "users", uid));
    try {
      await deleteUser(firebaseUser);
      return { ok: true };
    } catch (err) {
      if (profileData) {
        try {
          await setDoc(doc(db, "users", uid), profileData);
        } catch {
          // best-effort rollback; surfacing the original error matters more
        }
      }
      return {
        ok: false,
        error: authErrorMessage((err as { code?: string }).code ?? ""),
      };
    }
  }

  async function updateProfile(
    patch: Partial<Pick<User, "name" | "grade" | "className">>,
  ) {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;
    await updateDoc(doc(db, "users", firebaseUser.uid), patch);
  }

  const value: AuthContextValue = {
    users,
    currentUser,
    authLoading,
    signup,
    login,
    logout,
    withdraw,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
