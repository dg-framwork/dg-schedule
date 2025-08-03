// G:/dg-BattleRoyal/ui/src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import Schedule from "./pages/Schedule";
import Manage from "./pages/Manage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Schedule />
    <Manage />
  </React.StrictMode>
);
