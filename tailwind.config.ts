
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
                serif: ['var(--font-serif)', 'Georgia', 'serif'],
            },
            colors: {
                background: '#F7F5F2',
                surface: '#FFFFFF',
                primary: {
                    DEFAULT: '#1F4E46', // Deep Teal
                    hover: '#183D37',
                    light: '#E6F0EE',
                },
                secondary: {
                    DEFAULT: '#D4A373', // Muted Gold/Sand
                    hover: '#C59364',
                    light: '#F5EBE0',
                },
                text: {
                    main: '#2D2A26', // Warm Black
                    muted: '#6B665E', // Warm Grey
                    light: '#9CA3AF',
                },
                border: '#E6E2DD',
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                foreground: "hsl(var(--foreground))",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
export default config;
