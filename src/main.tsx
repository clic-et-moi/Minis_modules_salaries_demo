import { createRoot } from "react-dom/client";
import { Component, type ReactNode } from "react";
import App from "./App.tsx";
import "./index.css";

// Forcer le mode clair
localStorage.removeItem('theme');
document.documentElement.classList.remove('dark');

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  state = { hasError: false, error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '600px', margin: '2rem auto' }}>
          <h1 style={{ color: '#c00' }}>Erreur de chargement</h1>
          <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
            {this.state.error.message}
          </pre>
          <p>Ouvre la console du navigateur (F12 → Console) pour plus de détails.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootEl = document.getElementById("root");
if (!rootEl) {
  document.body.innerHTML = '<p style="padding:2rem;font-family:system-ui">Élément #root introuvable.</p>';
} else {
  createRoot(rootEl).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
