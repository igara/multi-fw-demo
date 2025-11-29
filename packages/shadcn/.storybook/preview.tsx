import type { Preview } from "@storybook/react-vite";
import { useEffect } from "react";

// テーマのマッピング
const themes = {
  default: "./themes/default.css",
  green: "./themes/green.css",
  blue: "./themes/blue.css",
};

// デフォルトテーマを読み込み
import "../src/themes/default.css";

// テーマ切り替え関数
const switchTheme = (themeName: string) => {
  // 既存のテーマCSSを削除
  const existingLinks = document.querySelectorAll("link[data-theme]");
  existingLinks.forEach((link) => {
    if (link.parentNode) {
      link.parentNode.removeChild(link);
    }
  });

  // 新しいテーマCSSを追加
  if (themeName !== "default") {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = themes[themeName as keyof typeof themes];
    link.setAttribute("data-theme", themeName);
    document.head.appendChild(link);
  }
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },

    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#333333",
        },
      ],
    },
  },

  globalTypes: {
    theme: {
      name: "Theme",
      description: "Global theme for components",
      defaultValue: "default",
      toolbar: {
        icon: "paintbrush",
        items: [
          {
            value: "default",
            title: "Default Theme",
          },
          {
            value: "green",
            title: "Green Theme",
          },
          {
            value: "blue",
            title: "Blue Theme",
          },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const theme = context.globals.theme;

      useEffect(() => {
        switchTheme(theme);
      }, [theme]);

      return <Story />;
    },
  ],
};

export default preview;
