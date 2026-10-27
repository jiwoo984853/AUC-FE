import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import ReactQueryProvider from "@/router/ReactQueryProvider";

import App from "./App";

import "@/styles/global.css";

const CHUNK_RELOAD_TIME_KEY = "chunk-reload-time";
const CHUNK_RELOAD_COOLDOWN = 10_000;

window.addEventListener("vite:preloadError", event => {
  event.preventDefault();

  const lastReloadTime = Number(
    sessionStorage.getItem(CHUNK_RELOAD_TIME_KEY) ?? 0
  );

  if (Date.now() - lastReloadTime < CHUNK_RELOAD_COOLDOWN) return;

  sessionStorage.setItem(CHUNK_RELOAD_TIME_KEY, String(Date.now()));
  window.location.reload();
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactQueryProvider>
      <App />
    </ReactQueryProvider>
  </StrictMode>
);
