# API Security Analyzer

Live Demo: https://api-security-analyzer.vercel.app/

API Security Analyzer is a full-stack web application that scans public API endpoints for common security issues and generates detailed security reports. Users can create accounts, save scans, review historical results, and manage custom report metadata through an interactive dashboard.

## Features

### Security Scanning
- Security header analysis
- Sensitive data exposure detection
- Authentication exposure checks
- Cookie security validation
- CORS configuration analysis
- Rate limiting detection
- Risk score calculation and severity classification

### User Authentication
- Firebase Authentication
- User registration and login
- Protected routes
- Per-user scan history

### Report Management
- Save scan results to database
- View historical scan reports
- Edit report titles, types, icons, and notes
- Pin important reports
- Search and filter reports
- Detailed findings and recommendations

### Analytics Dashboard
- Risk score visualization
- Severity breakdown
- Scan history metrics
- Average risk score tracking
- Critical scan tracking
- Latest scan activity

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Lucide React

### Backend
- FastAPI
- Python
- SQLAlchemy
- PostgreSQL

### Database & Deployment
- Neon PostgreSQL
- Render
- Vercel

## Security Checks Performed

### Security Headers
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Strict-Transport-Security
- Referrer-Policy

### Sensitive Data Detection
- password
- token
- api_key
- secret
- access_token
- refresh_token
- private_key

### Additional Checks
- Authentication exposure
- Cookie security
- CORS misconfiguration
- Rate limiting support

## Risk Scoring

Each finding contributes to an overall risk score between 0 and 100.

| Severity | Score Contribution |
|-----------|-----------|
| Critical | 30 |
| High | 20 |
| Medium | 10 |
| Low | 5 |

Risk levels are classified as:
- No Risk
- Low
- Medium
- High
- Critical

## Running Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn src.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Future Improvements

- PDF report exports
- Additional security checks
- Report sharing
- Scan scheduling
- Improved visualizations
