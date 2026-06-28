export type Finding = {
  id: number;
  scan_id: number;
  title: string;
  severity: Severity;
  category: string;
  description: string;
  evidence: string;
  recommendation: string;
}

export type ScanResult = {
  scan_id: number;
  target_url: string;
  status_code: number;
  findings: Finding[];
  risk_score: number;
  risk_level: string;
  risk_summary: string;
  severity_counts: {
    Critical: number;
    High: number;
    Medium: number;
    Low: number;
  };
  created_at: string;
  time_passed: number;
  total_findings: number;
  category_counts: Record<string, number>;
};

export type ScanHistoryItem = {
  id: number;
  target_url: string;
  status_code: number;
  risk_score: number;
  risk_level: string;
  risk_summary: string;
  total_findings?: number;
  created_at: string;
  report_title?: string | null;
  report_type?: string | null;
  report_icon?: string | null;
  notes?: string | null;
}

export type ScanReport = {
  scan: ScanHistoryItem;
  findings: Finding[];
};

export type Severity = "Critical" | "High" | "Medium" | "Low";