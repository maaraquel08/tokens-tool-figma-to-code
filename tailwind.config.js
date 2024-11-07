const typographyTheme = require("./dist/tailwind/theme.js");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx,html,css}",
        "./*.html",
        "./test.html",
        "./index.html",
    ],
    prefix: "tw-",
    theme: {
        extend: {
            fontFamily: {
                main: ["Rubik", "sans-serif"],
                inbound: ["Roboto", "sans-serif"],
                code: ["Roboto Mono", "monospace"],
            },
            ...typographyTheme.theme.extend,
        },
    },
    plugins: [
        plugin(function ({ addComponents }) {
            addComponents({
                ".tw-heading-xl": {
                    "@apply tw-font-main tw-text-900 tw-leading-900 tw-font-bold tw-tracking-dense":
                        {},
                },
                ".tw-heading-lg": {
                    "@apply tw-font-main tw-text-800 tw-leading-800 tw-font-bold tw-tracking-dense":
                        {},
                },
                ".tw-heading-md": {
                    "@apply tw-font-main tw-text-700 tw-leading-700 tw-font-bold tw-tracking-dense":
                        {},
                },
                ".tw-body-lg": {
                    "@apply tw-font-main tw-text-400 tw-leading-400 tw-font-normal":
                        {},
                },
            });
        }),
    ],
};
