import { createRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Index } from "./routes/index";
import { Multi } from "./routes/multi";
import { routeTree } from "./routeTree.gen";

let basePath = "/multi-fw-demo/react/";
if (window.location.pathname.startsWith("/multi-fw-demo/nextjs")) {
  basePath = "/multi-fw-demo/nextjs/";
}
if (window.location.pathname.startsWith("/multi-fw-demo/vue2")) {
  basePath = "/multi-fw-demo/vue2/";
}

const indexRoute = createRoute({
  getParentRoute: () => routeTree,
  path: "/",
  component: Index,
});

const multiRoute = createRoute({
  getParentRoute: () => routeTree,
  path: "multi.html",
  component: Multi,
});

// Create a new router instance
const router = createRouter({
  routeTree: routeTree.addChildren([indexRoute, multiRoute]),
  basepath: basePath,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// ShadowRoot内でマウントできるようにグローバル関数を作成
declare global {
  interface Window {
    mountReactApp: (container: HTMLElement) => void;
  }
}

window.mountReactApp = (container: HTMLElement) => {
  const root = ReactDOM.createRoot(container);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
};

// 通常のマウント(開発時やスタンドアロン実行時)
const rootElement = document.getElementById("react-app")!;
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
