# AtmosIQ - AI-Powered Environmental Decision Command Center

AtmosIQ is a premium, high-fidelity AI-powered decision command center designed to translate atmospheric complex telemetry and forecasts into industry-specific, actionable operational intelligence.

---

## 🚀 Key Features

* **Ask AtmosIQ AI Assistant**: Interact with a persistent chat agent backed by Google Gemini and Weather AI.
* **Onboarding & Dynamic Analytics**: Filter priority dashboards and opportunities to match custom industry selections.
* **Indexed Decision Logs**: View, audit, search, and delete saved atmospheric recommendations backed by a live serverless database.
* **Sleek HSL UI Design**: Stunning micro-animations, glassmorphic card overlays, custom SVG graphics, and full dark/light theme support.

---

## 🛠️ Technology Stack

1. **Frontend**: [Next.js](https://nextjs.org/) (React App Router, Client States, Dynamic Styling)
2. **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict compilation configurations)
3. **Database & Backend**: [Convex](https://convex.dev/) (Serverless Database, Live queries, schema indexing mutations)
4. **LLM Engine**: Google [Gemini LLM](https://ai.google.dev/) (Using JSON mode to extract meteorological factors, reasoning, and confidence)
5. **Weather Data Provider**: [Weather AI](https://weather-ai.co/) (Standardized REST weather forecasting)
6. **Icons & Assets**: [Lucide React](https://lucide.dev/) (High-fidelity inline vector glyphs)

---

## 📋 Prerequisites

Ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (Version `18.x` or later recommended)
* [npm](https://www.npmjs.com/) (Node Package Manager, typically preloaded with Node)
* [Git](https://git-scm.com/) (For version control and source code pulling)

---

## 🔧 Environment Variables Setup

Create a file named `.env.local` in the root of the project workspace and add the following keys:

```ini
# Convex Backend Cloud URL (Provided after running `npx convex dev`)
NEXT_PUBLIC_CONVEX_URL="https://your-deployment-url.convex.cloud"

# Google Gemini API Credentials Key (https://aistudio.google.com/)
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere..."

# Weather AI Authorized API Key (https://weather-ai.co/docs)
WEATHER_AI_API_KEY="your-weather-ai-api-key-here"
```

---

## 📦 Installation & Local Setup

Execute the following commands to install dependencies, run the serverless Convex database, and launch the Next.js development server.

### 1. Clone & Install Dependencies
First, install all necessary project dependencies via npm:
```bash
# Clone the repository (if not already local)
git clone https://github.com/Morces/almostiq.git
cd almostiq

# Install local package nodes
npm install
```

### 2. Launch Convex Local Backend Sync
Convex coordinates database changes and triggers types generation in real time. Run the development environment:
```bash
# This starts the Convex dev client, registers schemas, and watches for code updates
npx convex dev
```
*Note: Upon first launch, Convex will prompt you to log in via browser and link a free development project deployment. Once completed, copy the generated cloud URL value and add it as `NEXT_PUBLIC_CONVEX_URL` inside `.env.local`.*

### 3. Start Next.js Development Server
In a separate terminal window, start the local server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for Production
To verify typescript correctness and generate optimized static pages:
```bash
npm run build
```

---

## 📁 Directory Structure

```
├── app/
│   ├── (auth)/             # Login and Registration routes
│   ├── api/
│   │   ├── analyze/        # Coordinate Weather AI + Gemini + Convex Insertion route
│   │   └── history/        # History list endpoint
│   ├── dashboard/          # Dashboard panels, AI console, settings, and history pages
│   ├── onboarding/         # Onboarding grid setup
│   └── layout.tsx & page   # Hero page
├── components/             # Reusable UI widgets (Navbar, Popovers)
├── convex/
│   ├── schema.ts           # Convex database schema schemas definition
│   ├── users.ts            # User profile queries and mutations
│   ├── recommendations.ts  # Advisory cards log CRUD operations
│   └── chats.ts            # Persistent console chats query and mutations
├── lib/
│   ├── state.ts            # State synchronization manager
│   ├── weather.ts          # External Weather AI fetching API client
│   └── gemini.ts           # Google Gemini content generator client
└── types/                  # TypeScript interface mappings
```

---

## 🔮 Future Roadmap Plans

1. **Active Modules Tier Upgrade**:
   - Upgrade standard profiles to paid packages to allow toggling more than 3 active industry modules.
   - Integrate Stripe/LemonSqueezy webhooks to handle subscription checkout checks.
2. **Multi-User Workspace Sharing**:
   - Establish joint team views allowing multiple operators to read recommendations, log reports, and discuss telemetry forecasts in unified dashboard streams.
3. **Advanced Telemetry Analytics**:
   - Expand integrations to query custom weather balloon feeds, agricultural sensor grids, or private corporate forecast models.
