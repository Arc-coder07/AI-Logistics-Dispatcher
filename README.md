<div align="center">

# 🚀 AI Logistics Dispatcher

### Autonomous Logistics Simulation Control Tower

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-5-orange?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

A sophisticated **digital twin** of a logistics network running entirely in the browser. Features **7 autonomous AI agents** that collaborate in real-time to manage fleets, optimize routes, predict delays, and resolve disruptions — all visualized through a stunning dark-mode control tower interface.

[**Live Demo →**](https://arc-coder07.github.io/AI-Logistics-Dispatcher/)

</div>

---

## 🎥 Demo

<video src="./public/demo-video-compressed.mp4" controls width="100%"></video>

---

## 📸 Screenshots

<div align="center">

### 🗺️ Dispatcher View — Real-Time Operations

<img src="./public/image2.png" alt="Dispatcher View — Live fleet map, orders, warehouses, agents, and disruption simulation" width="1000"/>

> The main operational interface. Watch live vehicles move across the grid, manage active orders, track warehouse capacity, and trigger disruptions in real-time. Features a 3-column layout with the fleet map, alert center, AI copilot, agent collaboration network, and decision feed — all updating simultaneously.

---

### 📊 Analytics View — Executive KPI Dashboard

<img src="./public/image3.png" alt="Analytics View — Fleet health, driver leaderboard, and predictive delay risk" width="1000"/>

> Executive-level KPI dashboard. View Fleet Health (battery degradation & maintenance risk scores), Driver Leaderboards with on-time percentage and fuel efficiency, and Predictive Delay Risk cards with real-time SLA compliance calculations.

---

### 🏠 Overview

<img src="./public/image1.png" alt="Project Overview — Full interface at a glance" width="1000"/>

> Full interface at a glance — showing the complete control tower experience with all panels active and agents processing events.

</div>

---

## ✨ Features

### 🧠 Multi-Agent AI System
A network of **7 specialized AI agents** that autonomously detect, reason about, and resolve operational anomalies in real-time:

| Agent | Role | Responsibilities |
|-------|------|-----------------|
| **🎯 Dispatch Agent** | Assignment Optimizer | Assigns drivers to orders using proximity, workload, and capacity analysis |
| **🗺️ Routing Agent** | Path Optimizer | Calculates alternative routes when delays are detected; A* pathfinding |
| **⏱️ Delay Agent** | Risk Predictor | Scores delay probability (0-100%) per order using multi-factor analysis |
| **🔧 Fleet Agent** | Vehicle Monitor | Tracks fuel, battery, engine health, and triggers maintenance alerts |
| **📊 Operations Agent** | Insights Generator | Synthesizes cross-system insights for executive-level decision support |
| **📡 Communication Agent** | Notification Handler | Drafts customer and maintenance team notifications automatically |
| **👁️ Monitoring Agent** | System Watchdog | Detects systemic issues (overload, SLA breaches) and raises critical alerts |

### 🔗 Agent Collaboration Chains
When a disruption occurs, agents cascade through collaboration chains:

```
Disruption Detected
    └── Delay Agent (risk scoring)
          └── Routing Agent (alternative path calculation)
                └── Dispatch Agent (driver reassignment evaluation)
                      └── Communication Agent (stakeholder notifications)
                            └── Operations Agent (incident logging)
```

All cascades are visualized in real-time in the **Decision Feed** and **Agent Collaboration View**.

### 🌐 Digital Twin Simulation
- **Browser-native**: The entire simulation runs client-side using `requestAnimationFrame` — no backend required
- **Adjustable speed**: 1x, 2x, 4x, 8x simulation speeds via controls or the command palette
- **Pause/Resume**: Full control over the simulation loop
- **Dynamic order generation**: Orders spawn procedurally with varying priorities (Critical, High, Normal)

### 💥 Disruption Simulator
Trigger real-time disruptions and watch the AI agents respond:

| Disruption | Effect |
|-----------|--------|
| 🚗 Traffic Jam | Congestion zone causes delay risk for nearby vehicles |
| 🌧️ Heavy Rain | Weather hazard slows down all drivers in the affected area |
| 🔧 Vehicle Breakdown | A vehicle goes offline, triggering reassignment chains |
| 📈 Demand Spike | Sudden order surge strains warehouse capacity |
| 🚧 Road Closure | Blocked routes force the Routing Agent to find alternatives |
| 🏭 Warehouse Failure | Warehouse goes into failure mode, redirecting orders |
| 🪧 Driver Strike | Drivers go offline, creating capacity shortages |

### ⌨️ Command Palette
Press **`Cmd + K`** (Mac) or **`Ctrl + K`** (Windows/Linux) to open the command palette:
- Toggle simulation speed (1x / 2x / 4x / 8x)
- Pause and resume the simulation
- Switch between Dispatcher and Analytics views
- Trigger specific disruptions instantly

### 🤖 AI Copilot
An intelligent assistant that dynamically synthesizes live data from all active stores (Orders, Disruptions, Drivers, Vehicles) to answer operational queries in natural language.

### 🔎 Expandable Panels
Click the **Maximize** icon on data-dense panels (Timeline, Decision Feed, Delivery Replay, Agent Collaboration) to expand them into full-screen immersive modal views. Press **Escape** to close.

---

## 🏗️ Architecture

### High-Level Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                            │
│  ┌─────────┐ ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ FleetMap │ │AlertCenter│ │  Orders  │ │ Copilot  │ │ Analytics│  │
│  │ (Leaflet)│ │           │ │  Panel   │ │  Panel   │ │ Dashboard│  │
│  └────┬─────┘ └─────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘  │
│       │             │            │             │            │        │
├───────┼─────────────┼────────────┼─────────────┼────────────┼────────┤
│       │       STATE MANAGEMENT LAYER (Zustand)              │        │
│  ┌────┴──────┐ ┌────┴─────┐ ┌───┴────┐ ┌──────┴──┐ ┌──────┴──┐    │
│  │driverStore│ │alertStore│ │orderSto-│ │copilotS-│ │analytics│    │
│  │vehicleSto-│ │disruptio-│ │re       │ │tore     │ │Store    │    │
│  │re         │ │nStore    │ │         │ │         │ │         │    │
│  └────┬──────┘ └────┬─────┘ └───┬────┘ └────┬────┘ └────┬────┘    │
│       │             │           │            │           │          │
├───────┼─────────────┼───────────┼────────────┼───────────┼──────────┤
│       │         ENGINE LAYER                 │           │          │
│  ┌────┴──────┐ ┌────┴─────┐ ┌───┴────┐ ┌────┴────┐ ┌───┴──────┐  │
│  │driverEngi-│ │trafficEn-│ │orderEn-│ │warehous-│ │vehicleEn-│  │
│  │ne         │ │gine      │ │gine    │ │eEngine  │ │gine      │  │
│  └────┬──────┘ └────┬─────┘ └───┬────┘ └────┬────┘ └────┬─────┘  │
│       │             │           │            │           │          │
├───────┼─────────────┼───────────┼────────────┼───────────┼──────────┤
│       │          AGENT LAYER                 │           │          │
│  ┌────┴──────┐ ┌────┴─────┐ ┌───┴────┐ ┌────┴────┐ ┌───┴──────┐  │
│  │ Dispatch  │ │ Routing  │ │ Delay  │ │  Fleet  │ │Operations│  │
│  │  Agent    │ │  Agent   │ │ Agent  │ │  Agent  │ │  Agent   │  │
│  └───────────┘ └──────────┘ └────────┘ └─────────┘ └──────────┘  │
│       ▲             ▲           ▲            ▲           ▲          │
│       └─────────────┴───────────┴────────────┴───────────┘          │
│                    Agent Orchestrator + Event Bus                    │
└──────────────────────────────────────────────────────────────────────┘
```

### The Simulation Loop (`useSimulation.ts`)
The heartbeat of the application is a global game-loop powered by `requestAnimationFrame` that ticks at **1-second intervals** (at 1x speed). Each tick orchestrates:

1. **`driverEngine`** — Updates driver GPS positions, manages shift fatigue and stamina
2. **`orderEngine`** — Spawns new delivery orders, updates active vehicle coordinates via A* pathfinding
3. **`vehicleEngine`** — Degrades fuel, battery, and engine health; calculates risk scores
4. **`warehouseEngine`** — Processes loading queues and tracks utilization bottlenecks
5. **`trafficEngine`** — Generates dynamic weather and congestion zones across the map

### The Agent Network & Event Bus
Agents communicate through a **publish-subscribe event bus** with 22+ event types:

```
ORDER_CREATED → DRIVER_ASSIGNED → DELIVERY_COMPLETED
DISRUPTION_DETECTED → DELAY_RISK_DETECTED → ROUTE_UPDATED
VEHICLE_RISK_DETECTED → MAINTENANCE_RECOMMENDED
COLLABORATION_CHAIN_STARTED → COLLABORATION_CHAIN_COMPLETED
...and more
```

When a disruption occurs (e.g., "Traffic Jam"), the orchestrator fires an event into the bus. The **Routing Agent** detects the delay, re-routes the vehicle, and passes context to the **Delay Agent**. The Delay Agent analyzes SLA risk and escalates to the **Dispatch Agent** if a higher-priority driver needs to be assigned. All of this is visualized in real-time in the **Decision Feed**.

### State Management (14 Zustand Stores)

| Store | Purpose |
|-------|---------|
| `driverStore` | Driver profiles, locations, status, workload |
| `orderStore` | Active/completed orders, priorities, ETAs |
| `vehicleStore` | Vehicle health, fuel, battery, maintenance |
| `warehouseStore` | Warehouse capacity, loading queues, utilization |
| `alertStore` | Active alerts with severity and recommendations |
| `disruptionStore` | Active disruption events with affected areas |
| `agentStore` | Agent decisions, collaboration chains, status |
| `timelineStore` | Chronological event log for the activity feed |
| `simulationStore` | Simulation speed, pause state, tick counter |
| `copilotStore` | Chat messages for the AI copilot interface |
| `analyticsStore` | Predictive analytics and trend data |
| `driverPerformanceStore` | On-time %, fuel efficiency, ratings |
| `deliveryHistoryStore` | Completed delivery records for replay |

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | [Next.js](https://nextjs.org/) (App Router, Static Export) | 16.2.9 |
| **UI Library** | [React](https://react.dev/) | 19.2.4 |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.x |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 4.x |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) | 5.x |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | 12.x |
| **Map Rendering** | [React Leaflet](https://react-leaflet.js.org/) + [Leaflet](https://leafletjs.com/) | 5.x / 1.9.4 |
| **Icons** | [Lucide React](https://lucide.dev/) | 1.x |
| **Date Utils** | [date-fns](https://date-fns.org/) | 4.x |
| **CSS Utilities** | [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | — |
| **Deployment** | [gh-pages](https://github.com/tschaub/gh-pages) | 6.x |

---

## 📁 Project Structure

```
AI-Logistics-Dispatcher/
├── public/
│   ├── image1.png              # Overview screenshot
│   ├── image2.png              # Dispatcher view screenshot
│   └── image3.png              # Analytics view screenshot
│
├── src/
│   ├── agents/                 # 🧠 AI Agent Implementations
│   │   ├── agentOrchestrator.ts    # Multi-agent coordination & cascading
│   │   ├── communicationAgent.ts   # Notification drafting agent
│   │   ├── delayAgent.ts           # Delay risk prediction agent
│   │   ├── dispatchAgent.ts        # Driver-order assignment agent
│   │   ├── eventBus.ts             # Pub/sub event bus for inter-agent comms
│   │   ├── fleetAgent.ts           # Vehicle health monitoring agent
│   │   ├── monitoringAgent.ts      # System watchdog agent
│   │   ├── operationsAgent.ts      # Insights & analytics agent
│   │   └── routingAgent.ts         # Path optimization agent
│   │
│   ├── engines/                # ⚙️ Simulation Engines
│   │   ├── driverEngine.ts         # Driver movement & fatigue
│   │   ├── orderEngine.ts          # Order lifecycle & A* pathfinding
│   │   ├── trafficEngine.ts        # Weather & congestion generation
│   │   ├── vehicleEngine.ts        # Vehicle degradation simulation
│   │   └── warehouseEngine.ts      # Loading queue management
│   │
│   ├── store/                  # 📦 Zustand State Stores
│   │   ├── types.ts                # Core type definitions (319 lines)
│   │   ├── driverStore.ts          # Driver state management
│   │   ├── orderStore.ts           # Order state management
│   │   ├── vehicleStore.ts         # Vehicle state management
│   │   ├── warehouseStore.ts       # Warehouse state management
│   │   ├── alertStore.ts           # Alert state management
│   │   ├── disruptionStore.ts      # Disruption state management
│   │   ├── agentStore.ts           # Agent decisions & chains
│   │   ├── simulationStore.ts      # Simulation controls
│   │   ├── timelineStore.ts        # Activity timeline events
│   │   ├── copilotStore.ts         # AI copilot chat state
│   │   ├── analyticsStore.ts       # Predictive analytics
│   │   ├── driverPerformanceStore.ts # Performance metrics
│   │   └── deliveryHistoryStore.ts # Delivery records
│   │
│   ├── components/             # 🎨 UI Components
│   │   ├── panels/                 # Major dashboard panels (18 files)
│   │   │   ├── top-nav.tsx
│   │   │   ├── kpi-strip.tsx
│   │   │   ├── fleet-map.tsx
│   │   │   ├── fleet-map-wrapper.tsx
│   │   │   ├── alert-center.tsx
│   │   │   ├── orders-panel.tsx
│   │   │   ├── copilot-panel.tsx
│   │   │   ├── warehouse-panel.tsx
│   │   │   ├── disruption-simulator.tsx
│   │   │   ├── agent-collaboration-view.tsx
│   │   │   ├── decision-feed.tsx
│   │   │   ├── activity-timeline.tsx
│   │   │   ├── delivery-replay.tsx
│   │   │   ├── simulation-controls.tsx
│   │   │   ├── fleet-health-panel.tsx
│   │   │   ├── driver-leaderboard.tsx
│   │   │   ├── predictive-cards.tsx
│   │   │   └── executive-metrics.tsx
│   │   │
│   │   ├── ui/                     # Reusable UI primitives (6 files)
│   │   │   ├── alert-card.tsx
│   │   │   ├── animated-counter.tsx
│   │   │   ├── metric-card.tsx
│   │   │   ├── order-card.tsx
│   │   │   ├── status-badge.tsx
│   │   │   └── timeline-item.tsx
│   │   │
│   │   ├── command-palette.tsx
│   │   └── Logo.tsx
│   │
│   ├── hooks/
│   │   ├── useSimulation.ts        # Master simulation game loop
│   │   └── useCommandPalette.ts    # Command palette keyboard handler
│   │
│   ├── lib/
│   │   ├── simulation/
│   │   │   └── locations.ts        # City coordinates & route data
│   │   └── utils.ts                # Helper functions (cn, formatters)
│   │
│   └── app/                    # 📄 Next.js App Router
│       ├── layout.tsx
│       ├── page.tsx
│       ├── globals.css
│       └── favicon.ico
│
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** (bundled with Node.js) or **pnpm**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Arc-coder07/AI-Logistics-Dispatcher.git

# 2. Navigate to the project directory
cd AI-Logistics-Dispatcher

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [**http://localhost:3000**](http://localhost:3000) in your browser. The simulation starts automatically.

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| **Dev** | `npm run dev` | Start the Next.js dev server with hot reload |
| **Build** | `npm run build` | Generate a static production build in `out/` |
| **Start** | `npm start` | Serve the production build locally |
| **Lint** | `npm run lint` | Run ESLint to check for code issues |
| **Deploy** | `npm run deploy` | Build + deploy to GitHub Pages via `gh-pages` |

---

## 🌐 Deployment

### GitHub Pages (Recommended)

This project is pre-configured for static export, making it ideal for **GitHub Pages**:

1. The `next.config.ts` already uses `output: 'export'` and sets `basePath` to `/AI-Logistics-Dispatcher` in production.

2. Deploy with a single command:
   ```bash
   npm run deploy
   ```
   This will:
   - Build the static bundle (`next build`)
   - Create a `.nojekyll` file (so GitHub doesn't ignore `_next/` directories)
   - Push the `out/` directory to the `gh-pages` branch

3. In your GitHub repository settings, enable **Pages** from the `gh-pages` branch.

4. Your app will be live at:
   ```
   https://arc-coder07.github.io/AI-Logistics-Dispatcher/
   ```

### Other Platforms

Since this is a static export, you can also deploy to:
- **Vercel** — `npm run build` → deploy the `out/` directory
- **Netlify** — Set build command to `npm run build` and publish directory to `out`
- **Cloudflare Pages** — Same static export setup
- **Any static file host** — Just serve the contents of `out/`

> **Note:** Remove the `basePath` from `next.config.ts` if you're deploying to a root domain (not a subpath).

---

## 🎮 Usage Guide

### Quick Start
1. **Watch the simulation** — Orders spawn automatically, drivers are assigned by the Dispatch Agent, and vehicles begin moving on the map
2. **Trigger a disruption** — Click the ⚡ button in the top nav, or press `Cmd+K` and type "traffic jam"
3. **Watch the agents react** — Open the Decision Feed to see the collaboration chain unfold in real-time
4. **Switch to Analytics** — Click "Analytics" in the top nav to see executive KPIs, fleet health, and driver performance

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Open Command Palette |
| `Escape` | Close expanded panel / command palette |

### Understanding the Interface

#### Dispatcher View (Default)
- **Left Column** — Fleet Map (Leaflet with live vehicle markers), Warehouse Panel, Orders Panel
- **Center Column** — Alert Center (severity-sorted with approve/reject actions), AI Copilot
- **Right Column** — Agent Collaboration Network (live agent status), Decision Feed
- **Bottom Bar** — Activity Timeline, Delivery Replay

#### Analytics View
- **Executive Metrics** — Aggregate KPIs with trend indicators
- **Predictive Cards** — Delay risk predictions and SLA compliance
- **Fleet Health Panel** — Per-vehicle battery, fuel, engine health, and risk scores
- **Driver Leaderboard** — Performance rankings by on-time %, rating, and efficiency
- **Agent Views** — Collaboration chains and decision log in a wider layout

---

## 🧪 How It Works

### Simulation Lifecycle

```
App Mounts
    │
    ├── Initialize Stores (drivers, vehicles, performance)
    ├── Boot 7 AI Agents (set to idle status)
    ├── Wire Agent Orchestrator (subscribe to event bus)
    ├── Generate 3 Initial Orders (staggered by 2s)
    │
    └── Start Game Loop (requestAnimationFrame)
          │
          ├── Every tick (1s at 1x speed):
          │     ├── driverEngine.tick()
          │     ├── orderEngine.tick()
          │     ├── vehicleEngine.tick()
          │     ├── warehouseEngine.tick()
          │     └── trafficEngine.tick()
          │
          ├── Every 15 ticks: delayAgent.analyze()
          ├── Every 20 ticks: monitoringAgent.checkForIssues()
          ├── Every 30 ticks: fleetAgent.monitor()
          │                   analyticsStore.updatePredictions()
          ├── Every 45 ticks: operationsAgent.generateInsights()
          └── Every 60 ticks: Cleanup old orders, alerts, timeline events
```

### Agent Collaboration Example

**Scenario:** A "Traffic Jam" disruption is triggered near Driver #3's route.

1. **Delay Agent** → Detects delay risk at 72% for Order #ORD-042
2. **Event Bus** → Emits `DELAY_RISK_DETECTED` event
3. **Agent Orchestrator** → Starts a new collaboration chain
4. **Routing Agent** → Calculates alternative route, saves ~8 minutes
5. **Event Bus** → Emits `ROUTE_UPDATED` event
6. **Dispatch Agent** → Evaluates if driver reassignment is needed
7. **Communication Agent** → Drafts customer notification with updated ETA
8. **Operations Agent** → Logs incident for analytics
9. **Chain Complete** → All steps visible in the Decision Feed with timing

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Areas for Contribution
- 🗺️ Real-world map data integration (OpenStreetMap routing)
- 📊 Additional analytics visualizations (charts, graphs)
- 🔊 Audio notifications for critical alerts
- 📱 Mobile-responsive layout improvements
- 🧪 Unit and integration tests
- 🌍 Internationalization (i18n) support
- ♿ Accessibility improvements (ARIA labels, keyboard navigation)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use it as a boilerplate for complex dashboard and simulation architectures.

---

<div align="center">

**Built with ❤️ using Next.js 16, React 19, and a lot of Zustand stores**

[⬆ Back to Top](#-ai-logistics-dispatcher)

</div>
