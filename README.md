# AI Logistics Dispatcher 🛰️
**Human-in-the-Loop Autonomous Operations Control Tower**

> A futuristic, AI-powered logistics operations dashboard built with Next.js 15, Zustand, and Framer Motion.

<!-- 
=========================================
🎥 DEMO PLACEHOLDER
=========================================
Replace the image below with your actual demo GIF, video, or screenshot.
-->
<p align="center">
  <img src="/public/demo-placeholder.png" alt="AI Logistics Dispatcher Demo" width="100%" />
</p>
<!-- To use a video instead, replace the img tag with: 
<video src="your-video-url.mp4" controls="controls" muted="muted" style="max-width: 100%;"></video> 
-->

## Overview
The AI Logistics Dispatcher is a mission-control style dashboard that blends the aesthetics of SpaceX, Linear, and Stripe with autonomous logistics dispatch. It simulates a real-time logistics fleet across San Francisco, complete with auto-generated orders, AI-driven dispatch, and human-in-the-loop oversight.

It demonstrates advanced modern frontend engineering, focusing on:
- 🤖 **Autonomous Decision Making**: AI agents assign drivers and recommend actions.
- 🧑‍💻 **Human-in-the-loop**: Operators must approve or reject critical AI recommendations.
- ⚡ **Real-time Systems**: Simulated live data flow using Zustand (mimicking WebSockets).
- 🗺️ **Interactive Mapping**: Live fleet tracking with Leaflet and OpenStreetMap.
- ✨ **Exceptional UX**: Dark mode first, glassmorphism, fluid animations with Framer Motion.

## Features

- **Operations Command Center**: Beautiful KPI cards with animated counters, trend indicators, and live pulse dots.
- **Interactive Fleet Map**: Live tracking of 8 simulated drivers across San Francisco with custom markers and route polylines.
- **Driver & Order Simulation Engines**: Drivers move automatically every few seconds. New orders are generated based on real-world probability distributions.
- **AI Alert Center**: Continuous monitoring generates alerts for traffic, weather, or driver overload, including confidence scores and predicted impact.
- **AI Copilot Panel**: A persistent chat interface that queries live dashboard data to generate intelligent, context-aware responses to operator queries.
- **Disruption Simulator**: Test operational resilience by manually triggering traffic jams, severe weather, vehicle breakdowns, or demand spikes.

## Architecture

The application runs entirely client-side for immediate demo capability, utilizing an event-driven architecture that can easily be decoupled and moved to a real backend (e.g., FastAPI/Supabase).

### AI Agents
1. **Dispatch Agent**: Scores drivers based on distance (40%), workload (35%), and rating (25%) to assign orders, generating human-readable reasoning.
2. **Monitoring Agent**: Scans for anomalies (delayed deliveries, overloaded drivers) every 20 seconds and issues alerts.
3. **Routing Agent**: Optimizes routes and suggests rerouting during active disruptions.
4. **Communication Agent**: Powers the AI Copilot by synthesizing data from all stores to answer operator queries.

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Map**: Leaflet (`react-leaflet`)
- **Styling**: TailwindCSS v4 + Custom Glassmorphism CSS
- **Icons**: Lucide React

## Quick Start

Run the project locally to see the simulation in action.

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-logistics-dispatcher.git
cd ai-logistics-dispatcher
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```text
src/
├── agents/            # AI Agents and Event Bus logic
├── app/               # Next.js App Router (layout, globals.css, main page)
├── components/
│   ├── panels/        # Major dashboard sections (Map, Alerts, Copilot, etc.)
│   └── ui/            # Reusable primitives (Metric Cards, Badges, Timeline Items)
├── hooks/             # Custom hooks (e.g., useSimulation master loop)
├── lib/               # Utilities and simulation data (SF locations, names)
└── store/             # Zustand stores for state management
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
