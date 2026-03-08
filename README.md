# Build With Iqra — A Full-Stack Developer Journey Hub

A platform to track coding logs, DSA problems, and project showcases — powered by AI analysis, social media generation, and Stripe payments.

## 🚀 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend:** Supabase (Auth, Database, Storage, Edge Functions)
- **AI:** Anthropic Claude API (code analysis & social post generation)
- **Payments:** Stripe (one-time tips & monthly subscriptions)
- **Build Tool:** Vite

## ✨ Features

- **AI-Powered Code Analysis** — Get logic explanations, complexity breakdowns, and optimization suggestions for DSA solutions via Claude.
- **Social Media Post Generator** — Auto-generate Instagram and LinkedIn captions from your coding logs.
- **Stripe Payment Integration** — Accept one-time tips ($5) and monthly support ($10) through Stripe Checkout.
- **Coding Log** — Track daily learning with tags, descriptions, and code snippets.
- **DSA Problem Library** — Organize problems by category, difficulty, and platform with status tracking.
- **Project Showcase** — Display projects with images, descriptions, GitHub links, and live URLs.
- **Authentication** — Secure email-based sign-up and login.

## 🛠️ How to Run

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/build-with-iqra.git

# 2. Navigate to the project directory
cd build-with-iqra

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Environment Variables

The following environment variables are required (provided automatically via Lovable Cloud):

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key |

Edge functions require `ANTHROPIC_API_KEY` and `STRIPE_SECRET_KEY` configured as backend secrets.

## 📄 License

MIT
