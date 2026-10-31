# amonomics-checkout 🚀
> Industry-leading, secure, and professional developer support and micro-funding platform for open-source project sustainability with Stripe checkout, GitHub telemetry, and Google Gemini 3.8 Flash AI.

---

## Architecture Overview

```text
                  ┌───────────────────────────────────────────────┐
                  │    Supporter Chooses Project & Tier ($5-$150) │
                  └───────────────────────┬───────────────────────┘
                                          │
                                          ▼
                  ┌───────────────────────────────────────────────┐
                  │        Stripe Checkout Session (POST)         │
                  │             (/api/checkout)                   │
                  └───────────────────────┬───────────────────────┘
                                          │
           ┌──────────────────────────────┴──────────────────────────────┐
           ▼                                                             ▼
┌─────────────────────────────────────┐               ┌─────────────────────────────────────┐
│    Stripe Webhook / Success Modal   │               │     Gemini 3.8 Flash API Route      │
│     Verifies payment clearance      │──────────────▶│   Generates custom AI appreciation  │
│                                     │               │           (/api/thank-you)          │
└─────────────────────────────────────┘               └─────────────────────────────────────┘
                                                                         │
                                                                         ▼
                                                      ┌─────────────────────────────────────┐
                                                      │  • Personalized Maintainer Letter   │
                                                      │  • Tangible CI/CD Impact Metric     │
                                                      │  • Custom Code Snippet Tribute      │
                                                      │  • Cryptographic Digital Backer Pass│
                                                      └─────────────────────────────────────┘
```

---

## 🛠️ Integrated High-Impact Tools & Features

1. **AI Dependency Sustainability & Debt Scanner (`/api/ai/scan-dependencies`)**:
   - Paste any `package.json` or choose presets.
   - Evaluates supply chain risks, solo-maintainer packages (Bus Factor = 1), calculates an **Ecosystem Sustainability Debt Score** (0-100), and provides a 1-click bundle pledge.

2. **Dynamic README Sponsor Grid & SVG Badge Generator (`/api/badge/:projectId.svg`)**:
   - Generates real-time, self-updating SVG badges for GitHub `README.md`.
   - Generates formatted Markdown sponsor grid tables.

3. **Milestone & Issue Micro-Bounties (`/api/bounties`)**:
   - Crowdfund specific GitHub issues and feature requests (e.g. Issue #142 ARM64 SIMD Optimization).
   - Real-time pledge progress meters and contributor claim tracking.

4. **Public Financial Ledger (`/api/ledger`)**:
   - Open Collective-style radical transparency ledger showing money in (verified Stripe receipts) vs. money out (macOS/Linux CI runners, fuzzing compute, maintainer hourly stipends).
   - Exportable to `.csv` format.

5. **Stripe Corporate Net-30 Invoicing (`/api/corporate-invoice`)**:
   - Enterprise procurement flow for companies requiring formal Purchase Orders, VAT/Tax ID verification, and Net-30 invoice terms.

6. **AI Release Changelog Sponsor Tribute (`/api/ai/generate-changelog`)**:
   - Uses Gemini 3.8 Flash to compose release notes with dedicated backer tributes attributing specific PRs and CI compute to community sponsors.

7. **Cryptographic Digital Backer Pass (`DigitalBackerPassModal`)**:
   - Official backer certificate with SHA-256 verification hash, maintainer badge, and 1-click print/PDF download.

8. **Live GitHub Telemetry & Profile Verification (`/api/github/user/:username`)**:
   - Live GitHub account verification using `GITHUB_TOKEN`, verifying sponsor avatars and follower counts.
