import {
  createContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
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

// Real school email accounts stop working after graduation, so the school
// email is only used at signup time to verify school membership — it is
// never the login credential. Login uses a separate username instead,
// mapped to a synthetic @drchive.local address under the hood since
// Firebase's email/password provider requires an email-shaped identifier.
const SCHOOL_EMAIL_DOMAIN = "dsm.hs.kr";
const SCHOOL_EMAIL_RE = new RegExp(
  `^[^\\s@]+@${SCHOOL_EMAIL_DOMAIN.replace(/\./g, "\\.")}$`,
  "i",
);
const USERNAME_RE = /^[a-zA-Z0-9_]{4,20}$/;
const INTERNAL_EMAIL_DOMAIN = "drchive.local";

function toInternalEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${INTERNAL_EMAIL_DOMAIN}`;
}

type SignupInput = {
  name: string;
  username: string;
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
  login: (username: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  withdraw: () => Promise<AuthResult>;
  updateProfile: (
    patch: Partial<
      Pick<User, "name" | "grade" | "className" | "themeColor" | "avatarUrl">
    >,
  ) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<AuthResult>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

function authErrorMessage(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "이미 사용 중인 아이디예요.";
    case "auth/invalid-email":
      return "아이디 형식이 올바르지 않아요.";
    case "auth/weak-password":
      return "비밀번호는 6자 이상이어야 해요.";
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "아이디 또는 비밀번호가 올바르지 않아요.";
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
  // While true, the profile onSnapshot below ignores updates. withdraw()
  // needs this: it deletes the profile doc, then may have to restore it if
  // deleteUser() fails, and without suppression the live listener sees the
  // doc vanish for a moment and reports the user as logged out — which
  // bounces the whole app to the login screen and back, losing their place.
  const suppressProfileSync = useRef(false);

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
        if (suppressProfileSync.current) return;
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
    const username = input.username.trim().toLowerCase();
    const email = input.email.trim().toLowerCase();
    const name = input.name.trim();
    if (!name) return { ok: false, error: "이름을 입력해주세요." };
    if (!USERNAME_RE.test(username)) {
      return {
        ok: false,
        error: "아이디는 영문/숫자/밑줄(_)로 4~20자여야 해요.",
      };
    }
    if (!SCHOOL_EMAIL_RE.test(email)) {
      return {
        ok: false,
        error: `학교 이메일 형식이 올바르지 않아요. (@${SCHOOL_EMAIL_DOMAIN} 이메일만 가능해요)`,
      };
    }
    if (input.password.length < 6) {
      return { ok: false, error: "비밀번호는 6자 이상이어야 해요." };
    }

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        toInternalEmail(username),
        input.password,
      );
      const profile: Omit<User, "id"> = {
        username,
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

  async function login(username: string, password: string): Promise<AuthResult> {
    try {
      await signInWithEmailAndPassword(
        auth,
        toInternalEmail(username),
        password,
      );
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
    suppressProfileSync.current = true;
    try {
      // Firestore's delete rule requires an authenticated request, so the
      // profile doc has to go before the auth account. If deleteUser() then
      // fails (e.g. session isn't "recent" enough), restore the profile so
      // the account isn't left orphaned — deleted profile, but email still
      // registered and impossible to sign up again with. Sync is suppressed
      // throughout so the live listener doesn't react to the doc briefly
      // not existing and bounce the app to the login screen and back.
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
    } catch (err) {
      // getDoc/deleteDoc failed before the auth account was ever touched —
      // nothing to roll back, just report it instead of letting it escape
      // as an unhandled rejection.
      return {
        ok: false,
        error: authErrorMessage((err as { code?: string }).code ?? ""),
      };
    } finally {
      suppressProfileSync.current = false;
      // deleteUser() succeeding signs the SDK out locally, so auth.currentUser
      // is already null there and onAuthStateChanged(null) fires on its own —
      // this manual resync only matters for the rollback (failure) path.
      if (auth.currentUser) {
        try {
          const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
          setCurrentUser(
            snap.exists()
              ? ({ id: auth.currentUser.uid, ...snap.data() } as User)
              : null,
          );
        } catch {
          // best-effort resync; don't let this override the result above
        }
      }
    }
  }

  async function updateProfile(
    patch: Partial<
      Pick<User, "name" | "grade" | "className" | "themeColor" | "avatarUrl">
    >,
  ) {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return;
    await updateDoc(doc(db, "users", firebaseUser.uid), patch);
  }

  async function changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<AuthResult> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser || !firebaseUser.email) {
      return { ok: false, error: "로그인이 필요해요." };
    }
    if (newPassword.length < 6) {
      return { ok: false, error: "새 비밀번호는 6자 이상이어야 해요." };
    }
    try {
      // Password changes require a "fresh" session, so reauthenticate with
      // the current password first — this also doubles as verifying it.
      const credential = EmailAuthProvider.credential(
        firebaseUser.email,
        currentPassword,
      );
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, newPassword);
      return { ok: true };
    } catch (err) {
      const code = (err as { code?: string }).code ?? "";
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        return { ok: false, error: "현재 비밀번호가 올바르지 않아요." };
      }
      return {
        ok: false,
        error: authErrorMessage(code),
      };
    }
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
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
