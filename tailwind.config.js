/**
 * Tailwind CSS Configuration
 * This file configures Tailwind CSS with our design system tokens and custom utilities.
 */

// Import generated token configurations
const colorTokens = require("./dist/tailwind/theme.js");
const typographyTokens = require("./dist/tailwind/typography.js");
const spacingTokens = require("./dist/tailwind/spacing.js");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
    // Prefix all Tailwind classes to avoid conflicts
    prefix: "tw-",

    // Define which files Tailwind should scan for class usage
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx,html,css}", // All source files
        "./*.html", // Root HTML files
        "./test-spacing.html", // Add this explicitly if needed
    ],

    // Safelist ensures these patterns are always included in the build
    // even if they're not found in the content files
    safelist: [
        // Only safelist custom and dynamic utilities
        {
            // Typography system
            pattern: /^tw-(font-size|line-height|letter-spacing|font-weight)-/,
        },
        {
            // Custom spacing system
            pattern:
                /^tw-(p|m|gap)[trblxy]?-(6xs|5xs|4xs|3xs|2xs|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl)$/,
            variants: ["hover", "focus", "responsive"],
        },
        // ... other custom utilities
    ],

    // Theme Configuration
    theme: {
        extend: {
            // Extend theme with our design tokens
            ...colorTokens.extend,
            ...spacingTokens.extend,
            spacing: spacingTokens.extend.spacing,
            maxWidth: spacingTokens.extend.maxWidth,
            borderRadius: spacingTokens.extend.borderRadius,
            gap: spacingTokens.extend.spacing,
            fontFamily: {
                main: "var(--font-family-main)",
                inbound: "var(--font-family-inbound)",
                code: "var(--font-family-code)",
            },
        },
    },

    // Custom Plugin Configuration
    plugins: [
        plugin(function ({ addUtilities }) {
            /**
             * Generate Font Size Utilities
             * Creates classes for each font size token
             * Example: .font-size-100 { font-size: var(--font-size-100) }
             */
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

            /**
             * Generate Line Height Utilities
             * Creates classes for each line height token
             * Example: .line-height-100 { line-height: var(--font-lineHeight-100) }
             */
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

            /**
             * Generate Letter Spacing Utilities
             * Creates classes for each letter spacing token
             * Example: .letter-spacing-wide { letter-spacing: var(--font-letterSpacing-wide) }
             */
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

            /**
             * Generate Font Weight Utilities
             * Creates classes for each font weight token
             * Example: .font-weight-bold { font-weight: var(--font-weight-bold) }
             */
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

            /**
             * Heading Style Utilities
             * Predefined heading styles with consistent typography settings
             */
            const headingUtilities = {
                // Extra Large Heading
                ".heading-xl": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-900)", // Largest size
                    "line-height": "var(--font-lineHeight-1000)",
                    "font-weight": "var(--font-weight-medium)",
                    "letter-spacing": "var(--font-letterSpacing-denser)",
                },
                // ... similar pattern for other heading sizes ...
            };

            /**
             * Subheading Style Utilities
             * Smaller heading variants with different spacing characteristics
             */
            const subheadingUtilities = {
                ".subheading-sm": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-400)", // 20px
                    "line-height": "var(--font-lineHeight-500)", // 24px
                    "font-weight": "var(--font-weight-medium)", // 500
                    "letter-spacing": "var(--font-letterSpacing-dense)", // -0.7px
                },
                // ... similar pattern for other subheading sizes ...
            };

            /**
             * Body Text Style Utilities
             * Text styles for main content with size and weight variations
             */
            const bodyTextUtilities = {
                // Large Body Text Styles
                ".body-lg-regular": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-400)",
                    "line-height": "var(--font-lineHeight-600)",
                    "font-weight": "var(--font-weight-normal)",
                    "letter-spacing": "var(--font-letterSpacing-normal)",
                },
                // ... similar pattern for other body text variations ...
            };

            /**
             * Label Style Utilities
             * Compact text styles for UI labels and small text elements
             */
            const labelUtilities = {
                // Small Label Styles
                ".label-sm-regular": {
                    "font-family": "var(--font-family-main)",
                    "font-size": "var(--font-size-200)",
                    "line-height": "var(--font-lineHeight-200)",
                    "font-weight": "var(--font-weight-normal)",
                    "letter-spacing": "var(--font-letterSpacing-wide)",
                },
                // ... similar pattern for other label variations ...
            };

            // Add spacing utilities if needed
            const spacingUtilities = {
                ".max-w-screen": {
                    "max-width": "100vw",
                },
                ".w-screen": {
                    width: "100vw",
                },
                ".h-screen": {
                    height: "100vh",
                },
            };

            // Register all custom utilities with Tailwind
            addUtilities({
                ...fontSizeUtilities,
                ...lineHeightUtilities,
                ...letterSpacingUtilities,
                ...fontWeightUtilities,
                ...headingUtilities,
                ...subheadingUtilities,
                ...bodyTextUtilities,
                ...labelUtilities,
                ...spacingUtilities,
            });
        }),
    ],
};
