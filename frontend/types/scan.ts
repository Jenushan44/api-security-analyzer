export type Finding = {
  title: string;
  severity: string;
  category: string;
  description: string;
  evidence: string;
  recommendation: string;
}

export type ScanResult = {
  scan_id: number;
  target_url: string;
  status_code: string;
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
  category_counts: Record<string, number>;
};