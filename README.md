# AI Logistics Dispatcher 🚀

An Autonomous Logistics Simulation Control Tower built with **Next.js 16**, **React**, **Zustand**, and **Framer Motion**. This project serves as a sophisticated digital twin of a logistics network, demonstrating real-time event-driven agent collaboration, dynamic pathfinding, and disruption simulation.

![Control Tower UI](./public/screenshot.png)

## ✨ Core Capabilities

- **Digital Twin Simulation:** Runs entirely in the browser using `requestAnimationFrame`, simulating fleets, live traffic, and dynamic order prioritization.
- **Multi-Agent Architecture:** A network of 7 distinct AI agents (Dispatch, Routing, Operations, Fleet, Delay, Communication, Monitoring) that collaborate to resolve anomalies automatically.
- **Predictive Analytics:** An Executive Analytics layer featuring KPI tracking, predictive delay modeling, and real-time SLA compliance calculations.
- **Command Palette:** Keyboard-driven interface (`Cmd + K`) for instant control over simulation speed, disruption triggers, and view toggling.
- **AI Copilot:** An intelligent assistant that dynamically synthesizes data from all live stores (Orders, Disruptions, Drivers, Vehicles) to answer operational queries.

## 🛠 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + `lucide-react`
- **State Management:** Zustand (8+ stores managing distinct slices of the simulation)
- **Animations:** Framer Motion
- **Map Rendering:** Custom CSS Grid + SVG pathing

## 🏗 System Architecture

### The Simulation Loop (`useSimulation.ts`)
The heartbeat of the app is a global game-loop that ticks every 500ms (at 1x speed). It orchestrates:
1. `orderEngine`: Spawns new deliveries and updates active vehicle GPS coordinates using A* pathfinding.
2. `driverEngine`: Tracks driver shift fatigue and stamina.
3. `trafficEngine`: Generates dynamic weather and congestion zones.
4. `agentOrchestrator`: Triggers collaborative AI agent chains based on system events.

### The Agent Network
When a disruption occurs (e.g., a "Traffic Jam"), the orchestrator fires an event into the bus. The `Routing Agent` detects the delay, re-routes the vehicle, and passes context to the `Delay Agent`. The `Delay Agent` analyzes SLA risk and escalates to the `Dispatch Agent` if a higher-priority driver needs to be assigned. All of this is visualized in real-time in the **Decision Feed**.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗺 Application Layout

- **Dispatcher View:** The main operational interface. Watch live vehicles move across the grid, manage active orders, track warehouse capacity, and trigger disruptions.
- **Analytics View:** Executive-level KPI dashboard. View Fleet Health (battery degradation & maintenance), Driver Leaderboards, and Predictive Delay Risk mapping.

### UI Enhancements
- **Expandable Panels:** Click the `Maximize` icon on complex views like the *Activity Timeline* or *Delivery Replay* to view them in an expanded overlay.
- **Copilot Querying:** Ask the Copilot "Which drivers are overloaded?" to get real-time computed responses from the active simulation state.

## 📄 License
MIT License. Feel free to use this as a boilerplate for complex dashboard and simulation architectures.
