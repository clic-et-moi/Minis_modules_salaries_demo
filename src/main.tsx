import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Forcer le mode clair
localStorage.removeItem('theme');
document.documentElement.classList.remove('dark');

createRoot(document.getElementById("root")!).render(<App />);
