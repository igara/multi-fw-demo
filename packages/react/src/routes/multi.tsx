import { Button } from "@multi-fw-demo-igarashi/shadcn";
import "@multi-fw-demo-igarashi/shadcn/blue.css";

export function Multi() {
  const handleClick = () => {
    alert("Button clicked!");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Multi Framework Demo - Shadcn UI</h1>
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Button onClick={handleClick}>Default Button</Button>
        <Button variant="secondary" onClick={handleClick}>
          Secondary
        </Button>
        <Button variant="destructive" onClick={handleClick}>
          Destructive
        </Button>
        <Button variant="outline" onClick={handleClick}>
          Outline
        </Button>
        <Button variant="ghost" onClick={handleClick}>
          Ghost
        </Button>
        <Button variant="link" onClick={handleClick}>
          Link
        </Button>
      </div>
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <Button size="sm" onClick={handleClick}>
          Small
        </Button>
        <Button size="default" onClick={handleClick}>
          Default
        </Button>
        <Button size="lg" onClick={handleClick}>
          Large
        </Button>
      </div>
    </div>
  );
}
