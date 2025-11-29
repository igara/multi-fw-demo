"use client";

import { useSharedState } from "@multi-fw-demo/shared-state";
import { Button } from "@multi-fw-demo-igarashi/shadcn";

export function ShadcnCounter() {
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
    <div className="p-6 border-2 border-orange-500 rounded-lg bg-orange-50">
      <h3 className="text-lg font-bold mb-4 text-orange-700">Shared Counter (Next.js App)</h3>
      <div className="text-4xl font-bold mb-6 text-orange-600">Count: {count ?? 0}</div>
      <div className="flex gap-4">
        <Button onClick={increment} variant="default">
          Increment
        </Button>
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
