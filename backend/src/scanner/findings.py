from scanner.rules import rules 

def add_finding(findings, request_key):
  rule = rules[request_key]

  findings.append({
    "title": rule["title"],
    "severity": rule["severity"],
    "category": rule["category"],
    "evidence":  rule["evidence"],
    "recommendation": rule["recommendation"],
})