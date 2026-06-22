# AI Logistics Dispatcher 🚀

An **Autonomous Logistics Simulation Control Tower** built with **Next.js 16**, **React**, **Zustand**, and **Framer Motion**. This project serves as a sophisticated digital twin of a logistics network, demonstrating real-time event-driven agent collaboration, dynamic pathfinding, and disruption simulation.

---

## 📸 Screenshots

### Dispatcher View
*(Placeholder for Dispatcher View Screenshot)*
> **Description:** The main operational interface. Watch live vehicles move across the grid, manage active orders, track warehouse capacity, and trigger disruptions in real-time.

### Analytics View
*(Placeholder for Analytics View Screenshot)*
> **Description:** Executive-level KPI dashboard. View Fleet Health (battery degradation & maintenance), Driver Leaderboards, and Predictive Delay Risk mapping.

---

## ✨ Core Capabilities

- **Digital Twin Simulation:** Runs entirely in the browser using `requestAnimationFrame`, simulating fleets, live traffic, and dynamic order prioritization.
- **Multi-Agent Architecture:** A network of 7 distinct AI agents (Dispatch, Routing, Operations, Fleet, Delay, Communication, Monitoring) that collaborate to resolve anomalies automatically.
- **Predictive Analytics:** An Executive Analytics layer featuring KPI tracking, predictive delay modeling, and real-time SLA compliance calculations.
- **Command Palette:** Keyboard-driven interface (`Cmd + K` or `Ctrl + K`) for instant control over simulation speed, disruption triggers, and view toggling.
- **AI Copilot:** An intelligent assistant that dynamically synthesizes data from all live stores (Orders, Disruptions, Drivers, Vehicles) to answer operational queries.
- **Expandable Modals:** Click the "Maximize" icon on data-dense panels (like the Timeline or Decision Feed) to pop them out into full-screen immersive views.

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + `lucide-react`
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (8+ modular stores managing distinct slices of the simulation)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Map Rendering:** [React Leaflet](https://react-leaflet.js.org/)

## 🏗 System Architecture

### The Simulation Loop (`useSimulation.ts`)
The heartbeat of the app is a global game-loop that ticks every 500ms (at 1x speed). It orchestrates:
1. **`orderEngine`**: Spawns new deliveries and updates active vehicle GPS coordinates using A* pathfinding.
2. **`driverEngine`**: Tracks driver shift fatigue and stamina.
3. **`trafficEngine`**: Generates dynamic weather and congestion zones.
4. **`agentOrchestrator`**: Triggers collaborative AI agent chains based on system events.

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

## 🌐 Deploying to GitHub Pages

This project is configured for static export, making it perfect for hosting on **GitHub Pages**.

1. Update your `next.config.ts` (Already done! It uses `output: 'export'` and `images: { unoptimized: true }`).
2. Add a `deploy` script to your `package.json` if using `gh-pages` or rely on GitHub Actions:
   ```json
   "scripts": {
     "build": "next build",
     "deploy": "touch out/.nojekyll && gh-pages -d out"
   }
   ```
   *(Note: The `.nojekyll` file is required so GitHub Pages doesn't ignore files starting with an underscore, like `_next`)*
3. Run `npm run build`. This generates a static `.html/.css/.js` bundle in the `out/` directory.
4. Upload the contents of the `out/` directory to your GitHub repository and enable GitHub pages from the repository settings.

## 📄 License
MIT License. Feel free to use this as a boilerplate for complex dashboard and simulation architectures.
