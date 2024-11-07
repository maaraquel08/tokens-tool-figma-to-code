const StyleDictionary = require("style-dictionary");

// Constants
const FONT_FALLBACKS = {
    Rubik: "sans-serif",
    Roboto: "sans-serif",
    "Roboto Mono": "monospace",
};

// Helper functions
function formatTokens(tokenGroup) {
    const result = {};
    for (const [key, token] of Object.entries(tokenGroup)) {
        result[key] = token.value;
    }
    return result;
}

function formatFontFamilies(families) {
    const result = {};
    for (const [key, token] of Object.entries(families)) {
        result[key] = [token.value, FONT_FALLBACKS[token.value]];
    }
    return result;
}

function formatTypographyPresets(typography) {
    const result = {};
    for (const [key, token] of Object.entries(typography)) {
        result[key] = {
            fontFamily: token.fontFamily.value,
            fontSize: token.fontSize.value,
            lineHeight: token.lineHeight.value,
            fontWeight: token.fontWeight.value,
            letterSpacing: token.letterSpacing.value,
        };
    }
    return result;
}

// Register custom format for Tailwind
StyleDictionary.registerFormat({
    name: "tailwind/theme",
    formatter: function ({ dictionary }) {
        const { tokens } = dictionary;

        // Format colors
        const colors = {};
        Object.entries(tokens.color).forEach(([colorName, shades]) => {
            colors[colorName] = {};
            Object.entries(shades).forEach(([shade, value]) => {
                colors[colorName][shade] = value.value;
            });
        });

        const theme = {
            fontFamily: {
                main: ["Rubik", "sans-serif"],
                inbound: ["Roboto", "sans-serif"],
                code: ["Roboto Mono", "monospace"],
            },
            fontSize: formatTokens(tokens.font.size),
            lineHeight: formatTokens(tokens.font.lineHeight),
            letterSpacing: formatTokens(tokens.font.letterSpacing),
            fontWeight: formatTokens(tokens.font.weight),
            typography: formatTypographyPresets(tokens.typography),
            colors: colors,
        };

        return `module.exports = {
    theme: {
        extend: {
            fontFamily: ${JSON.stringify(theme.fontFamily, null, 4)},
            fontSize: ${JSON.stringify(theme.fontSize, null, 4)},
            lineHeight: ${JSON.stringify(theme.lineHeight, null, 4)},
            letterSpacing: ${JSON.stringify(theme.letterSpacing, null, 4)},
            fontWeight: ${JSON.stringify(theme.fontWeight, null, 4)},
            typography: ${JSON.stringify(theme.typography, null, 4)},
            colors: ${JSON.stringify(theme.colors, null, 4)}
        }
    }
};`;
    },
});

// Add custom transform for handling pixel values
StyleDictionary.registerTransform({
    name: "size/px",
    type: "value",
    matcher: function (prop) {
        return prop.value.toString().includes("px");
    },
    transformer: function (prop) {
        return prop.value.toString();
    },
});

// Register transform group for web
StyleDictionary.registerTransformGroup({
    name: "web",
    transforms: ["attribute/cti", "size/px", "name/cti/kebab"],
});

module.exports = {
    source: ["src/tokens/**/*.json"],
    platforms: {
        css: {
            buildPath: "dist/css/",
            transformGroup: "web",
            files: [
                {
                    destination: "tokens.css",
                    format: "css/variables",
                    options: { selector: ":root" },
                },
            ],
        },
        tailwind: {
            buildPath: "dist/tailwind/",
            transformGroup: "web",
            files: [
                {
                    destination: "theme.js",
                    format: "tailwind/theme",
                },
            ],
        },
    },
};
