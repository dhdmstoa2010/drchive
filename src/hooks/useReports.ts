import { useContext } from "react";
import { ReportContext } from "../backend/context/ReportContext";

export function useReports() {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReports must be used within ReportProvider");
  return ctx;
}
