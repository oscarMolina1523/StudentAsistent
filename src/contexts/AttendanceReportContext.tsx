import React, { createContext, useContext, useState, ReactNode } from "react";

// Define el tipo de los datos del reporte
export type ReportData = {
  total: number;
  masculino: { presente: number; ausente: number; justificado: number };
  femenino: { presente: number; ausente: number; justificado: number };
  totalPresente: number;
  totalAusente: number;
  totalJustificado: number;
};

export type ReportsType = {
  [materiaId: string]: {
    [fecha: string]: ReportData;
  };
};

interface AttendanceReportContextProps {
  reports: ReportsType;
  saveReport: (materiaId: string, fecha: string, report: ReportData) => void;
  getAllReports: () => ReportsType;
}

const AttendanceReportContext = createContext<AttendanceReportContextProps | undefined>(undefined);

export const AttendanceReportProvider = ({ children }: { children: ReactNode }) => {
  const [reports, setReports] = useState<ReportsType>({});

  const saveReport = (materiaId: string, fecha: string, report: ReportData) => {
    setReports(prev => {
      const updated = { ...prev };
      if (!updated[materiaId]) updated[materiaId] = {};
      updated[materiaId][fecha] = report;
      return updated;
    });
  };

  const getAllReports = () => reports;

  return (
    <AttendanceReportContext.Provider value={{ reports, saveReport, getAllReports }}>
      {children}
    </AttendanceReportContext.Provider>
  );
};

export const useAttendanceReport = () => {
  const ctx = useContext(AttendanceReportContext);
  if (!ctx) throw new Error("useAttendanceReport debe usarse dentro de AttendanceReportProvider");
  return ctx;
};
