import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

globalThis.addEventListener("error", (e) => {
  console.error("[Game Error]", e.error?.message || e.message, e.error?.stack);
});
globalThis.addEventListener("unhandledrejection", (e) => {
  console.error("[Game Unhandled Promise]", e.reason);
});

createRoot(document.getElementById("root")!).render(<App />);
