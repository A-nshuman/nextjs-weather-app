import { Scale } from "@mui/icons-material";
import type { Config } from "tailwindcss";
import { transform } from "typescript";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#202020",
        secondary: "#2b2b2b",
        primary: "#e6f2f2",
        accent: "#9bdbde",
        'dull-blue': '#84d5ed',
        'bright-blue': '#2b83e2',
        'dull-red': '#ff6666',
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%) scaleY(1) rotateY(0deg)',
            transformOrigin: 'center bottom',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
          },
          '25%': {
            transform: 'scaleY(1) rotateY(0deg)',
            transformOrigin: 'center bottom',
          },
          '50%': {
            transform: 'translateY(0) scaleY(0.8) rotateY(360deg)',
            animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
            transformOrigin: 'center bottom',
          },
        }
      }
    },
  },
  plugins: [
    require('daisyui'),
  ],
};
export default config;

{/*
    $brighter-blue : #007fff;
    $bright-green : #00ff00;
    $bright-blue : #2b83e2;
    $dull-yellow : #ffcc33;
    $bright-red : #df2525;
    $dull-blue : #84d5ed;
    $dull-red : #FF6666;
    $orange : #ff7722;
    $light : #2b2b2b;
    $dark : #202020;
    $lime : #b3d23e;
*/}
