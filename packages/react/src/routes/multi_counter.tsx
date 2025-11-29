import { Button } from "@multi-fw-demo-igarashi/shadcn";
import "@multi-fw-demo-igarashi/shadcn/blue.css";
import { useSharedState } from "@multi-fw-demo/shared-state";

export function MultiCounter() {
  const [count, setCount] = useSharedState<number>("counter", 0);

  const increment = () => {
    setCount((count || 0) + 1);
  };

  const decrement = () => {
    setCount((count || 0) - 1);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div
      style={{
        padding: "1.5rem",
        border: "2px solid #3b82f6",
        borderRadius: "8px",
        backgroundColor: "#eff6ff",
      }}
    >
      <h2
        style={{ marginBottom: "1rem", fontSize: "1.125rem", fontWeight: "bold", color: "#1e40af" }}
      >
        Shared Counter (React App)
      </h2>
      <div
        style={{
          fontSize: "2.25rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          color: "#2563eb",
        }}
      >
        Count: {count ?? 0}
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Button onClick={increment}>Increment</Button>
        <Button onClick={decrement} variant="secondary">
          Decrement
        </Button>
        <Button onClick={reset} variant="outline">
          Reset
        </Button>
      </div>
    </div>
  );
}
