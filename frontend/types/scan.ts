export type ScanResult = {
  scan_id: number;
  target_url: string;
  status_code: string;
  findings: unknown[];
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