import type { Meta, StoryObj } from "@storybook/react";
import "../themes/default.css";

const meta = {
  title: "Themes/Color Palette",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const ColorSwatch = ({ name, variable }: { name: string; variable: string }) => {
  return (
    <div className="flex items-center gap-3 p-2">
      <div
        className="w-16 h-16 rounded-md border shadow-sm"
        style={{ backgroundColor: `var(${variable})` }}
      />
      <div className="flex-1">
        <div className="font-mono text-sm font-semibold">{name}</div>
        <div className="font-mono text-xs text-muted-foreground">{variable}</div>
      </div>
    </div>
  );
};

const ColorPaletteDisplay = () => {
  const colors = [
    { name: "Background", variable: "--background" },
    { name: "Foreground", variable: "--foreground" },
    { name: "Primary", variable: "--primary" },
    { name: "Primary Foreground", variable: "--primary-foreground" },
    { name: "Secondary", variable: "--secondary" },
    { name: "Secondary Foreground", variable: "--secondary-foreground" },
    { name: "Muted", variable: "--muted" },
    { name: "Muted Foreground", variable: "--muted-foreground" },
    { name: "Accent", variable: "--accent" },
    { name: "Accent Foreground", variable: "--accent-foreground" },
    { name: "Destructive", variable: "--destructive" },
    { name: "Card", variable: "--card" },
    { name: "Card Foreground", variable: "--card-foreground" },
    { name: "Popover", variable: "--popover" },
    { name: "Popover Foreground", variable: "--popover-foreground" },
    { name: "Border", variable: "--border" },
    { name: "Input", variable: "--input" },
    { name: "Ring", variable: "--ring" },
  ];

  const chartColors = [
    { name: "Chart 1", variable: "--chart-1" },
    { name: "Chart 2", variable: "--chart-2" },
    { name: "Chart 3", variable: "--chart-3" },
    { name: "Chart 4", variable: "--chart-4" },
    { name: "Chart 5", variable: "--chart-5" },
  ];

  const sidebarColors = [
    { name: "Sidebar", variable: "--sidebar" },
    { name: "Sidebar Foreground", variable: "--sidebar-foreground" },
    { name: "Sidebar Primary", variable: "--sidebar-primary" },
    {
      name: "Sidebar Primary Foreground",
      variable: "--sidebar-primary-foreground",
    },
    { name: "Sidebar Accent", variable: "--sidebar-accent" },
    {
      name: "Sidebar Accent Foreground",
      variable: "--sidebar-accent-foreground",
    },
    { name: "Sidebar Border", variable: "--sidebar-border" },
    { name: "Sidebar Ring", variable: "--sidebar-ring" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Base Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colors.map((color) => (
            <ColorSwatch key={color.variable} name={color.name} variable={color.variable} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Chart Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chartColors.map((color) => (
            <ColorSwatch key={color.variable} name={color.name} variable={color.variable} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Sidebar Colors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sidebarColors.map((color) => (
            <ColorSwatch key={color.variable} name={color.name} variable={color.variable} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const Themes: Story = {
  render: () => <ColorPaletteDisplay />,
};
