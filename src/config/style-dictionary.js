const StyleDictionary = require("style-dictionary");

/**
 * Color Resolution Transform
 *
 * Purpose: Handles color tokens that have light/dark variants.
 * This transform ensures that color tokens maintain their light/dark values
 * throughout the transformation process.
 *
 * Usage: Applied to color tokens in the text category
 * Example input:
 * {
 *   "color": {
 *     "text": {
 *       "primary": {
 *         "value": {
 *           "light": "#000000",
 *           "dark": "#FFFFFF"
 *         }
 *       }
 *     }
 *   }
 * }
 */
StyleDictionary.registerTransform({
    name: "resolve/color",
    type: "value",
    matcher: (token) => {
        return token.path[0] === "color" && token.path[1] === "text";
    },
    transformer: (token) => {
        return {
            light: token.original.value.light,
            dark: token.original.value.dark,
        };
    },
});

/**
 * Android Color Transform
 *
 * Purpose: Converts hex color values to Android-compatible format.
 * Android requires colors without the '#' prefix and in uppercase.
 *
 * Example transformations:
 * - "#FF5733" -> "FF5733"
 * - "#ff5733" -> "FF5733"
 *
 * Usage: Applied to all color tokens when building for Android
 */
StyleDictionary.registerTransform({
    name: "color/android",
    type: "value",
    matcher: (token) => token.path[0] === "color",
    transformer: (token) => {
        const hexToAndroid = (hex) => {
            return hex.replace("#", "").toUpperCase();
        };
        return {
            light: hexToAndroid(token.value.light),
            dark: hexToAndroid(token.value.dark),
        };
    },
});

/**
 * iOS Color Transform
 *
 * Purpose: Converts hex color values to iOS UIColor format.
 * iOS requires colors as UIColor objects with RGB values between 0 and 1.
 *
 * Example transformations:
 * - "#FF5733" -> UIColor(red: 1.000, green: 0.341, blue: 0.200, alpha: 1.0)
 * - "#000000" -> UIColor(red: 0.000, green: 0.000, blue: 0.000, alpha: 1.0)
 *
 * Usage: Applied to all color tokens when building for iOS
 */
StyleDictionary.registerTransform({
    name: "color/ios",
    type: "value",
    matcher: (token) => token.path[0] === "color",
    transformer: (token) => {
        const hexToUIColor = (hex) => {
            const r = parseInt(hex.substr(1, 2), 16) / 255;
            const g = parseInt(hex.substr(3, 2), 16) / 255;
            const b = parseInt(hex.substr(5, 2), 16) / 255;
            return `UIColor(red: ${r.toFixed(3)}, green: ${g.toFixed(
                3
            )}, blue: ${b.toFixed(3)}, alpha: 1.0)`;
        };
        return {
            light: hexToUIColor(token.value.light),
            dark: hexToUIColor(token.value.dark),
        };
    },
});

/**
 * CSS Variables Formatter
 *
 * Purpose: Generates CSS custom properties (variables) for colors with light/dark theme support.
 * Creates a root scope for light theme and a dark theme scope using data-theme attribute.
 *
 * Example input:
 * {
 *   "color": {
 *     "text": {
 *       "primary": {
 *         "value": {
 *           "light": "#000000",
 *           "dark": "#FFFFFF"
 *         }
 *       }
 *     }
 *   }
 * }
 *
 * Example output:
 * :root {
 *   --color-text-primary: #000000;
 * }
 * [data-theme="dark"] {
 *   --color-text-primary: #FFFFFF;
 * }
 */
StyleDictionary.registerFormat({
    name: "css/variables",
    formatter: function ({ dictionary }) {
        const variables = dictionary.allTokens
            .filter((token) => token.path[0] === "color")
            .map((token) => {
                const type = token.path[1];
                const path = token.path.slice(2).join("-");
                const cssVariable = `--color-${type}-${path}`;
                return `  ${cssVariable}: ${token.value.light};`;
            })
            .join("\n");

        const darkVariables = dictionary.allTokens
            .filter((token) => token.path[0] === "color")
            .map((token) => {
                const type = token.path[1];
                const path = token.path.slice(2).join("-");
                const cssVariable = `--color-${type}-${path}`;
                return `  ${cssVariable}: ${token.value.dark};`;
            })
            .join("\n");

        return [
            ":root {",
            variables,
            "}",
            "",
            '[data-theme="dark"] {',
            darkVariables,
            "}",
        ].join("\n");
    },
});

/**
 * Tailwind CSS Formatter
 *
 * Purpose: Generates a Tailwind theme configuration that uses CSS variables for colors.
 * This allows for dynamic theme switching while maintaining Tailwind's utility classes.
 *
 * Example output:
 * module.exports = {
 *   extend: {
 *     textColor: {
 *       primary: 'var(--color-text-primary)',
 *       // ... other text colors
 *     },
 *     backgroundColor: {
 *       // ... background colors
 *     },
 *     borderColor: {
 *       // ... border colors
 *     }
 *   }
 * }
 */
StyleDictionary.registerFormat({
    name: "javascript/tailwind",
    formatter: function ({ dictionary }) {
        const buildColorStructure = (colorType) => {
            return dictionary.allTokens
                .filter(
                    (token) =>
                        token.path[0] === "color" && token.path[1] === colorType
                )
                .reduce((acc, token) => {
                    const tokenPath = token.path.slice(2);
                    let current = acc;

                    tokenPath.forEach((path, index) => {
                        if (index === tokenPath.length - 1) {
                            current[
                                path
                            ] = `var(--color-${colorType}-${tokenPath.join(
                                "-"
                            )})`;
                        } else {
                            current[path] = current[path] || {};
                            current = current[path];
                        }
                    });

                    return acc;
                }, {});
        };

        const theme = {
            extend: {
                textColor: buildColorStructure("text"),
                backgroundColor: buildColorStructure("background"),
                borderColor: buildColorStructure("border"),
            },
        };

        return `module.exports = ${JSON.stringify(theme, null, 2)}`;
    },
});

/**
 * Android Colors XML Formatter
 *
 * Purpose: Generates Android color resources with light/dark variants.
 * Creates an XML file compatible with Android's resource system.
 */
StyleDictionary.registerFormat({
    name: "android/colors",
    formatter: function ({ dictionary }) {
        // Transform each token into Android color resources
        const colorResources = dictionary.allTokens
            .map((token) => {
                // Extract components from token path
                const type = token.path[1]; // e.g., "text", "background"
                const path = token.path.slice(2).join("_"); // Create resource name

                // Construct the full resource name
                // Example: color_text_primary
                const resourceName = `color_${type}_${path}`;

                // Generate both light and dark variant resources
                return (
                    // Light theme color resource
                    `    <color name="${resourceName}_light">@{${token.value.light}}</color>\n` +
                    // Dark theme color resource
                    `    <color name="${resourceName}_dark">@{${token.value.dark}}</color>`
                );
            })
            .join("\n");

        // Wrap color resources in Android XML structure
        return (
            `<?xml version="1.0" encoding="utf-8"?>\n` +
            `<resources>\n${colorResources}\n</resources>`
        );
    },
});

/**
 * iOS Swift Color Extension Formatter
 *
 * Purpose: Generates a UIColor extension with dynamic colors that automatically
 * adapt to the system's appearance (light/dark mode).
 *
 * Features:
 * - Supports iOS 13+ dark mode via UITraitCollection
 * - Provides fallback for older iOS versions
 * - Generates type-safe color properties
 */
StyleDictionary.registerFormat({
    name: "ios/swift",
    formatter: function ({ dictionary }) {
        // Generate color properties for UIColor extension
        const colorExtension = dictionary.allTokens
            .map((token) => {
                // Create Swift-compatible property name
                const type = token.path[1];
                const path = token.path.slice(2).join("_");
                const varName = `${type}_${path}`;

                // Generate Swift property with dynamic color support
                return (
                    // Define static color property
                    `    static var ${varName}: UIColor {\n` +
                    // Check for iOS 13+ availability (required for dark mode)
                    `        if #available(iOS 13.0, *) {\n` +
                    // Create dynamic color that responds to trait changes
                    `            return UIColor { traitCollection in\n` +
                    // Switch on interface style (light/dark)
                    `                switch traitCollection.userInterfaceStyle {\n` +
                    `                case .dark:\n` +
                    `                    return ${token.value.dark}\n` +
                    `                default:\n` +
                    `                    return ${token.value.light}\n` +
                    `                }\n` +
                    `            }\n` +
                    // Fallback for iOS < 13
                    `        } else {\n` +
                    `            return ${token.value.light}\n` +
                    `        }\n` +
                    `    }`
                );
            })
            .join("\n\n");

        // Generate complete Swift file with UIKit import and extension
        return `import UIKit\n\n` + `extension UIColor {\n${colorExtension}\n}`;
    },
});

/**
 * Typography JavaScript Formatter
 *
 * Purpose: Generates a JavaScript module containing typography tokens
 * organized by category for use in Tailwind CSS configuration.
 *
 * Categories include:
 * - fontSize
 * - lineHeight
 * - letterSpacing
 * - fontWeight
 * - fontFamily
 */
StyleDictionary.registerFormat({
    name: "javascript/typography",
    formatter: function ({ dictionary }) {
        // Group typography tokens by category
        const tokens = dictionary.allTokens
            // Filter for font-related tokens
            .filter((token) => token.path[0] === "font")
            .reduce((acc, token) => {
                // Extract category (size, weight, etc.) and name
                const category = token.path[1]; // e.g., "size", "weight"
                const name = token.path[2]; // e.g., "base", "lg"

                // Initialize category object if it doesn't exist
                if (!acc[category]) {
                    acc[category] = {};
                }

                // Add token to its category
                acc[category][name] = token.value;

                return acc;
            }, {});

        // Generate JavaScript module with Tailwind theme structure
        return `module.exports = ${JSON.stringify(
            {
                theme: {
                    fontSize: tokens.size,
                    lineHeight: tokens.lineHeight,
                    letterSpacing: tokens.letterSpacing,
                    fontWeight: tokens.weight,
                    fontFamily: tokens.family,
                },
            },
            null,
            2
        )}`;
    },
});

/**
 * Typography CSS Variables Formatter
 *
 * Purpose: Generates CSS custom properties for typography tokens.
 * Creates a clean, flat structure of CSS variables for typography values.
 */
StyleDictionary.registerFormat({
    name: "css/typography",
    formatter: function ({ dictionary }) {
        // Generate CSS custom properties for typography tokens
        const variables = dictionary.allTokens
            // Filter for font-related tokens
            .filter((token) => token.path[0] === "font")
            .map((token) => {
                // Create CSS variable name from token path
                // Example: font-size-base -> --font-size-base
                const path = token.path.join("-");
                return `  --${path}: ${token.value};`;
            })
            .join("\n");

        // Wrap variables in :root selector
        return [":root {", variables, "}"].join("\n");
    },
});

/**
 * Style Dictionary Configuration
 *
 * Purpose: Defines the build configuration for different platforms and output formats.
 * This is the main configuration object that determines how design tokens are transformed
 * and output for each target platform.
 */
module.exports = {
    // Source files containing design tokens
    source: [
        "src/tokens/colors.json", // Base color definitions
        "src/tokens/semantic-colors.json", // Semantic color mappings
        "src/tokens/typography.json", // Typography definitions
    ],

    // Platform-specific build configurations
    platforms: {
        // CSS Platform Configuration
        css: {
            transformGroup: "css",
            // Transform pipeline for CSS output
            transforms: [
                "attribute/cti", // Category/Type/Item attributes
                "name/cti/kebab", // Kebab-case naming
                "time/seconds", // Time values to seconds
                "content/icon", // Icon content handling
                "size/rem", // Convert to rem units
                "color/css", // CSS color format
                "resolve/color", // Handle light/dark variants
            ],
            buildPath: "dist/css/",
            files: [
                {
                    destination: "tokens.css",
                    format: "css/variables",
                },
                {
                    destination: "typography.css",
                    format: "css/typography",
                },
            ],
        },

        // Tailwind Configuration
        tailwind: {
            transformGroup: "js",
            transforms: [
                "attribute/cti",
                "name/cti/kebab",
                "time/seconds",
                "content/icon",
                "size/rem",
                "color/css",
                "resolve/color",
            ],
            buildPath: "dist/tailwind/",
            files: [
                {
                    destination: "theme.js",
                    format: "javascript/tailwind",
                },
                {
                    destination: "typography.js",
                    format: "javascript/typography",
                },
            ],
        },

        // Android Platform Configuration
        android: {
            transformGroup: "android",
            transforms: [
                "attribute/cti",
                "name/cti/snake", // Snake_case naming for Android
                "color/android", // Android color format
                "resolve/color", // Handle light/dark variants
            ],
            buildPath: "dist/android/",
            files: [
                {
                    destination: "colors.xml",
                    format: "android/colors",
                },
            ],
        },

        // iOS Platform Configuration
        ios: {
            transformGroup: "ios",
            transforms: [
                "attribute/cti",
                "name/cti/camel", // CamelCase naming for Swift
                "color/ios", // iOS UIColor format
                "resolve/color", // Handle light/dark variants
            ],
            buildPath: "dist/ios/",
            files: [
                {
                    destination: "UIColor+Theme.swift",
                    format: "ios/swift",
                },
            ],
        },
    },
};
