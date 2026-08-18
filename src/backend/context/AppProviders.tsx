import type { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { NotificationProvider } from "./NotificationContext";
import { PhotoProvider } from "./PhotoContext";
import { CapsuleProvider } from "./CapsuleContext";
import { TagProvider } from "./TagContext";
import { ReportProvider } from "./ReportContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <NotificationProvider>
        <PhotoProvider>
          <CapsuleProvider>
            <TagProvider>
              <ReportProvider>{children}</ReportProvider>
            </TagProvider>
          </CapsuleProvider>
        </PhotoProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
