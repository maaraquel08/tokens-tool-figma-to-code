const colorTokens = require("./dist/tailwind/theme.js");
const typographyTokens = require("./dist/tailwind/typography.js");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
    prefix: "tw-",
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx,html,css}",
        "./*.html",
    ],
    safelist: [
        // Font Size
        { pattern: /^tw-font-size-\d+$/ },
        // Line Height
        { pattern: /^tw-line-height-\d+$/ },
        // Letter Spacing
        { pattern: /^tw-letter-spacing-/ },
        // Font Weight
        { pattern: /^tw-font-weight-/ },
        // Headings - Updated pattern to match new classes
        { pattern: /^tw-heading-(xl|lg|md|sm|xs)$/ },
        // Subheadings
        { pattern: /^tw-subheading-/ },
        // Body Text
        { pattern: /^tw-body-/ },
        // Labels
        { pattern: /^tw-label-/ },
        // Body Text with weights
        { pattern: /^tw-body-(lg|md|sm|xs)(-regular|-medium)?$/ },
        // Labels with weights
        { pattern: /^tw-label-(sm|xs)(-regular|-medium)?$/ },
        // Font Families
        { pattern: /^tw-font-(main|inbound|code)$/ },

        // Font Weights
        {
            pattern:
                /^tw-font-weight-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)$/,
        },
    ],
    theme: {
        extend: {
            ...colorTokens.extend,
            fontFamily: {
                main: "var(--font-family-main)",
                inbound: "var(--font-family-inbound)",
                code: "var(--font-family-code)",
            },
        },
    },
    plugins: [
        plugin(function ({ addUtilities }) {
            // Font Size utilities
            const fontSizeUtilities = Object.entries(
                typographyTokens.theme.fontSize
            ).reduce(
                (acc, [key, value]) => ({
                    ...acc,
                    [`.font-size-${key}`]: {
                        "font-size": `var(--font-size-${key})`,
                    },
                }),
                {}
            );

            const lineHeightUtilities = Object.entries(
                typographyTokens.theme.lineHeight
            ).reduce(
                (acc, [key, value]) => ({
                    ...acc,
                    [`.line-height-${key}`]: {
                        "line-height": `var(--font-lineHeight-${key})`,
                    },
                }),
                {}
            );

            const letterSpacingUtilities = Object.entries(
                typographyTokens.theme.letterSpacing
            ).reduce(
                (acc, [key, value]) => ({
                    ...acc,
                    [`.letter-spacing-${key}`]: {
                        "letter-spacing": `var(--font-letterSpacing-${key})`,
                    },
                }),
                {}
            );

            const fontWeightUtilities = Object.entries(
                typographyTokens.theme.fontWeight
            ).reduce(
                (acc, [key, value]) => ({
                    ...acc,
                    [`.font-weight-${key}`]: {
                        "font-weight": `var(--font-weight-${key})`,
                    },
                }),
                {}
            );

            // Heading Combinations
            const headingUtilities = {
                ".heading-xl": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-900)",
                    "line-height": "var(--font-lineHeight-1000)",
                    "font-weight": "var(--font-weight-medium)",
                    "letter-spacing": "var(--font-letterSpacing-denser)",
                },
                ".heading-lg": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-800)",
                    "line-height": "var(--font-lineHeight-900)",
                    "font-weight": "var(--font-weight-medium)",
                    "letter-spacing": "var(--font-letterSpacing-dense)",
                },
                ".heading-md": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-700)",
                    "line-height": "var(--font-lineHeight-800)",
                    "font-weight": "var(--font-weight-medium)",
                    "letter-spacing": "var(--font-letterSpacing-dense)",
                },
                ".heading-sm": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-600)",
                    "line-height": "var(--font-lineHeight-700)",
                    "font-weight": "var(--font-weight-medium)",
                    "letter-spacing": "var(--font-letterSpacing-dense)",
                },
                ".heading-xs": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-500)",
                    "line-height": "var(--font-lineHeight-600)",
                    "font-weight": "var(--font-weight-medium)",
                    "letter-spacing": "var(--font-letterSpacing-dense)",
                },
            };

            // Subheading Combinations
            const subheadingUtilities = {
                ".subheading-sm": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-400)", // 20px
                    "line-height": "var(--font-lineHeight-500)", // 24px
                    "font-weight": "var(--font-weight-medium)", // 500
                    "letter-spacing": "var(--font-letterSpacing-dense)", // -0.7px
                },
                ".subheading-xs": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-300)", // 16px
                    "line-height": "var(--font-lineHeight-400)", // 20px
                    "font-weight": "var(--font-weight-medium)", // 500
                    "letter-spacing": "var(--font-letterSpacing-normal)", // 0px
                },
            };

            // Body Text Combinations with Weight Variations
            const bodyTextUtilities = {
                // Large Body Text

                ".body-lg-regular": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-400)",
                    "line-height": "var(--font-lineHeight-600)",
                    "font-weight": "var(--font-weight-normal)",
                    "letter-spacing": "var(--font-letterSpacing-normal)",
                },
                ".body-lg-medium": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-400)",
                    "line-height": "var(--font-lineHeight-600)",
                    "font-weight": "var(--font-weight-medium)",
                    "letter-spacing": "var(--font-letterSpacing-normal)",
                },

                // Medium Body Text

                ".body-md-regular": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-300)",
                    "line-height": "var(--font-lineHeight-500)",
                    "font-weight": "var(--font-weight-normal)",
                    "letter-spacing": "var(--font-letterSpacing-normal)",
                },
                ".body-md-medium": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-300)",
                    "line-height": "var(--font-lineHeight-500)",
                    "font-weight": "var(--font-weight-medium)",
                    "letter-spacing": "var(--font-letterSpacing-normal)",
                },

                // Small Body Text

                ".body-sm-regular": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-200)",
                    "line-height": "var(--font-lineHeight-400)",
                    "font-weight": "var(--font-weight-normal)",
                    "letter-spacing": "var(--font-letterSpacing-normal)",
                },
                ".body-sm-medium": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-200)",
                    "line-height": "var(--font-lineHeight-400)",
                    "font-weight": "var(--font-weight-medium)",
                    "letter-spacing": "var(--font-letterSpacing-normal)",
                },

                // Extra Small Body Text

                ".body-xs-regular": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-100)",
                    "line-height": "var(--font-lineHeight-300)",
                    "font-weight": "var(--font-weight-normal)",
                    "letter-spacing": "var(--font-letterSpacing-normal)",
                },
                ".body-xs-medium": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-100)",
                    "line-height": "var(--font-lineHeight-300)",
                    "font-weight": "var(--font-weight-medium)",
                    "letter-spacing": "var(--font-letterSpacing-normal)",
                },
            };

            // Label Combinations with Weight Variations
            const labelUtilities = {
                // Small Labels

                ".label-sm-regular": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-200)",
                    "line-height": "var(--font-lineHeight-200)",
                    "font-weight": "var(--font-weight-normal)",
                    "letter-spacing": "var(--font-letterSpacing-wide)",
                },
                ".label-sm-medium": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-200)",
                    "line-height": "var(--font-lineHeight-200)",
                    "font-weight": "var(--font-weight-medium)",
                    "letter-spacing": "var(--font-letterSpacing-wide)",
                },

                // Extra Small Labels

                ".label-xs-regular": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-100)",
                    "line-height": "var(--font-lineHeight-100)",
                    "font-weight": "var(--font-weight-normal)",
                    "letter-spacing": "var(--font-letterSpacing-wide)",
                },
                ".label-xs-medium": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-100)",
                    "line-height": "var(--font-lineHeight-100)",
                    "font-weight": "var(--font-weight-medium)",
                    "letter-spacing": "var(--font-letterSpacing-wide)",
                },
            };

            addUtilities({
                ...fontSizeUtilities,
                ...lineHeightUtilities,
                ...letterSpacingUtilities,
                ...fontWeightUtilities,
                ...headingUtilities,
                ...subheadingUtilities,
                ...bodyTextUtilities,
                ...labelUtilities,
            });
        }),
    ],
};
