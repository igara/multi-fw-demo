import { Link } from "@tanstack/react-router";
import { useState } from "react";

export function Index() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: "1rem" }}>
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <Link to="/" activeOptions={{ exact: true }}>
          Home
        </Link>
        <Link to="/multi.html">Multi</Link>
      </nav>
      <hr />
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>React SPA with TanStack Router</h1>
        <div style={{ margin: "2rem 0" }}>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
        <p>
          Edit <code>src/routes/index.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
}
