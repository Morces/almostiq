# AtmosIQ - Development Guide

## Vision

**AtmosIQ** is an AI-powered decision intelligence platform built on top of Weather AI APIs.

Instead of presenting users with raw weather forecasts, AtmosIQ translates weather data into actionable recommendations for multiple industries.

**Core Philosophy:**

> Weather tells you what's coming.
>
> AtmosIQ tells you what to do about it.

---

# MVP Scope

The challenge is time-boxed to 48 hours.

The goal is not to build every feature, but to demonstrate:

- Clean architecture
- Strong product thinking
- Good API integration
- Modern UI/UX
- Scalability

---

# Supported Industries (MVP)

- Laundry
- Logistics
- Outdoor Events

The onboarding flow should support multiple selections, making the platform appear extensible for future industries.

Future industries:

- Agriculture
- Construction
- Solar Energy
- Hospitality
- Travel
- Car Wash

---

# Tech Stack

## Frontend

- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion

---

## Backend

- Next.js API Routes
- Convex
- Weather AI API

---

## Database

Convex will handle:

- User profiles
- Selected industries
- Saved recommendations
- Query history

---

# Application Flow

```
Landing Page
      │
      ▼
Login / Signup
      │
      ▼
Industry Selection
      │
      ▼
Dashboard
      │
      ▼
Ask AI Question
      │
      ▼
Next.js API Route
      │
      ├── Fetch Weather AI Data
      │
      ├── Normalize Response
      │
      └── Generate Recommendation
      │
      ▼
Store in Convex
      │
      ▼
Display Decision Card
```

---

# User Journey

## Landing Page

Purpose:

- Explain product value
- Showcase supported industries
- Drive signup

Primary CTA:

Start Free

Secondary CTA:

View Demo

---

## Authentication

Signup:

- Name
- Email
- Password

Login:

- Email
- Password

Authentication can use Convex Auth or Clerk if needed.

---

## Onboarding

Question:

"What industries do you work in?"

Allow multiple selections.

Example:

☑ Laundry

☑ Logistics

☐ Agriculture

☑ Outdoor Events

Save selections to user profile.

---

## Dashboard

Display:

### Header

Good Morning, Moses.

Today's weather created 3 actionable opportunities.

---

### Stats

- Connected Industries
- Recommendations Generated
- Average Confidence
- Current Weather Risk

---

### Recent Decisions

Card example:

```
Laundry

Recommendation:
Schedule pickups before noon.

Confidence:
92%

View Details
```

---

# AI Assistant

Input:

```
Should I schedule pickups tomorrow?
```

User selects:

- Industry
- Location

Submit.

---

# Recommendation Engine

## Step 1

Receive request.

Example:

```
{
  industry: "laundry",
  location: "Nairobi",
  question: "Should I schedule pickups tomorrow?"
}
```

---

## Step 2

Fetch Weather AI API.

---

## Step 3

Normalize response.

Internal model:

```
{
  temperature,
  humidity,
  rainChance,
  windSpeed,
  summary
}
```

---

## Step 4

Generate recommendation.

For MVP, use rule-based logic.

Example:

```
IF rainChance > 70

Return:

"Schedule pickups before noon.
Heavy rainfall expected this afternoon."
```

Future versions can integrate LLM reasoning.

---

## Step 5

Store recommendation.

Convex stores:

- User
- Industry
- Query
- Weather snapshot
- Generated recommendation
- Confidence
- Timestamp

---

# Convex Schema

## users

```
{
  name,
  email,
  industries[],
  createdAt
}
```

---

## recommendations

```
{
  userId,
  industry,
  location,
  question,
  recommendation,
  confidence,
  weatherData,
  createdAt
}
```

---

# API Structure

## POST

/api/analyze

Request:

```
{
  industry,
  location,
  question
}
```

Response:

```
{
  recommendation,
  confidence,
  weather
}
```

---

## GET

/api/history

Returns previous recommendations.

---

# Project Structure

```
app/
│
├── (marketing)/
│   ├── page.tsx
│   ├── features
│   └── industries
│
├── (auth)/
│   ├── login
│   └── signup
│
├── dashboard/
│   ├── page.tsx
│   ├── ai
│   ├── history
│   └── settings
│
├── api/
│   ├── analyze
│   └── history
│
components/
│
├── ui/
├── landing/
├── dashboard/
├── recommendation/
└── industry/
│
lib/
│
├── weather.ts
├── analyzer.ts
├── industries.ts
├── utils.ts
└── constants.ts
│
convex/
│
├── schema.ts
├── users.ts
└── recommendations.ts
│
types/
│
├── weather.ts
├── recommendation.ts
└── industry.ts
```

---

# Industry Engine

Create a configurable mapping.

```
const industries = {
  laundry: {
    title: "Laundry",
    icon: "shirt",
    prompt: "...",
  },

  logistics: {
    title: "Logistics",
    icon: "truck",
    prompt: "...",
  },

  events: {
    title: "Outdoor Events",
    icon: "calendar",
    prompt: "...",
  }
}
```

This allows easy expansion.

---

# UI Components

## Shared

- Navbar
- Theme Toggle
- Sidebar
- Card
- Modal
- Button
- Badge

---

## Landing

- Hero
- Features
- Industry Grid
- CTA Banner

---

## Dashboard

- Summary Cards
- Recommendation Card
- AI Chat Input
- History Table

---

# Theme

Use Weather AI inspired colors.

Support:

- Light Mode
- Dark Mode

Dark mode should use deep navy backgrounds.

Use CSS variables for theming.

---

# Future Roadmap

## V2

- AI LLM integration
- Real-time alerts
- Email notifications
- Team workspaces
- Analytics dashboard

## V3

- Agriculture module
- Solar forecasting
- Construction planning
- Travel intelligence

---

# Success Criteria

A successful submission should demonstrate:

- Excellent UI polish
- Clean code organization
- Thoughtful architecture
- Proper API integration
- Scalable design decisions
- Strong product vision

The final impression should be:

"This isn't just a weather app.

This is the foundation of a real SaaS product."

One architectural suggestion: don't make the AI engine weather-specific. Create an analyzer.ts service that accepts { industry, weatherData, question } and returns a recommendation. That abstraction makes the system look like it was designed for scale
