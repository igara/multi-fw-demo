"use client";

import { Button } from "@multi-fw-demo-igarashi/shadcn";
import "@multi-fw-demo-igarashi/shadcn/default.css";

export function ShadcnButton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <Button variant="default">Default Button</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>

      <div className="flex gap-4 items-center flex-wrap">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Button variant="default" onClick={() => alert("Button clicked!")}>
          Click Me
        </Button>
        <Button variant="outline" disabled>
          Disabled
        </Button>
      </div>
    </div>
  );
}
