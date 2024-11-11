const tokens = require("./dist/tailwind/theme.js");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
    prefix: "tw-",
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx,html,css}",
        "./*.html",
        // Add any other files that contain Tailwind classes
    ],
    theme: {
        extend: {
            ...tokens.extend,
            fontFamily: {
                main: ["Rubik", "sans-serif"],
                inbound: ["Roboto", "sans-serif"],
                code: ["Roboto Mono", "monospace"],
            },
        },
    },
    darkMode: ["class", '[data-theme="dark"]'],
    plugins: [
        plugin(function ({ addComponents }) {
            addComponents({
                ".tw-heading-xl": {
                    "@apply tw-font-main tw-text-900 tw-line-height-900 tw-font-bold tw-letter-spacing-dense":
                        {},
                },
                ".tw-heading-lg": {
                    "@apply tw-font-main tw-text-800 tw-line-height-800 tw-font-bold tw-letter-spacing-dense":
                        {},
                },
                ".tw-heading-md": {
                    "@apply tw-font-main tw-text-700 tw-line-height-700 tw-font-bold tw-letter-spacing-dense":
                        {},
                },
                ".tw-body-lg": {
                    "@apply tw-font-main tw-text-400 tw-line-height-400 tw-font-normal":
                        {},
                },
            });
        }),
    ],
};
