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

        // Format colors - Update this section
        const formatColorRecursively = (obj) => {
            const result = {};
            Object.entries(obj).forEach(([key, value]) => {
                if (value.value) {
                    // If it's a token with a value property
                    result[key] = value.value;
                } else {
                    // If it's a nested object
                    result[key] = formatColorRecursively(value);
                }
            });
            return result;
        };

        const colors = formatColorRecursively(tokens.color);

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

// Add iOS specific transforms
StyleDictionary.registerTransform({
    name: "size/swift",
    type: "value",
    matcher: function (prop) {
        return prop.value.toString().includes("px");
    },
    transformer: function (prop) {
        return prop.value.replace("px", "");
    },
});

// Add Android specific transforms
StyleDictionary.registerTransform({
    name: "size/dp",
    type: "value",
    matcher: function (prop) {
        return prop.value.toString().includes("px");
    },
    transformer: function (prop) {
        return prop.value.replace("px", "dp");
    },
});

// Register transform groups for iOS and Android
StyleDictionary.registerTransformGroup({
    name: "ios",
    transforms: ["attribute/cti", "size/swift", "name/cti/pascal"],
});

StyleDictionary.registerTransformGroup({
    name: "android",
    transforms: ["attribute/cti", "size/dp", "name/cti/snake"],
});

// Register iOS formats
StyleDictionary.registerFormat({
    name: "ios/colors.swift",
    formatter: function ({ dictionary, file }) {
        return `import UIKit

public enum TokenColors {
    ${dictionary.allProperties
        .map((prop) => {
            const color = prop.value;
            if (color.startsWith("#")) {
                const r = parseInt(color.substr(1, 2), 16) / 255;
                const g = parseInt(color.substr(3, 2), 16) / 255;
                const b = parseInt(color.substr(5, 2), 16) / 255;
                return `public static let ${prop.name} = UIColor(red: ${r}, green: ${g}, blue: ${b}, alpha: 1.0)`;
            }
            return "";
        })
        .filter(Boolean)
        .join("\n    ")}
}`;
    },
});

StyleDictionary.registerFormat({
    name: "ios/singleton.swift",
    formatter: function ({ dictionary, file }) {
        return `import UIKit

public enum TokenTypography {
    ${dictionary.allProperties
        .map((prop) => {
            if (prop.attributes.category === "font") {
                return `public static let ${prop.name} = ${prop.value}`;
            }
            return "";
        })
        .filter(Boolean)
        .join("\n    ")}
}`;
    },
});

// Register Android formats
StyleDictionary.registerFormat({
    name: "android/colors",
    formatter: function ({ dictionary }) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<resources>
    ${dictionary.allProperties
        .map((prop) => `<color name="${prop.name}">${prop.value}</color>`)
        .join("\n    ")}
</resources>`;
    },
});

StyleDictionary.registerFormat({
    name: "android/dimens",
    formatter: function ({ dictionary }) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<resources>
    ${dictionary.allProperties
        .map((prop) => `<dimen name="${prop.name}">${prop.value}</dimen>`)
        .join("\n    ")}
</resources>`;
    },
});

StyleDictionary.registerFormat({
    name: "android/resources",
    formatter: function ({ dictionary }) {
        return `<?xml version="1.0" encoding="UTF-8"?>
<resources>
    ${dictionary.allProperties
        .map(
            (prop) =>
                `<item name="${prop.name}" type="style">${prop.value}</item>`
        )
        .join("\n    ")}
</resources>`;
    },
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
        ios: {
            transformGroup: "ios",
            buildPath: "dist/ios/",
            files: [
                {
                    destination: "TokenColors.swift",
                    format: "ios/colors.swift",
                    className: "TokenColors",
                    filter: {
                        attributes: {
                            category: "color",
                        },
                    },
                },
                {
                    destination: "TokenTypography.swift",
                    format: "ios/singleton.swift",
                    className: "TokenTypography",
                    filter: {
                        attributes: {
                            category: "font",
                        },
                    },
                },
            ],
        },
        android: {
            transformGroup: "android",
            buildPath: "dist/android/",
            files: [
                {
                    destination: "colors.xml",
                    format: "android/colors",
                    filter: {
                        attributes: {
                            category: "color",
                        },
                    },
                },
                {
                    destination: "font_dimens.xml",
                    format: "android/dimens",
                    filter: {
                        attributes: {
                            category: "font",
                        },
                    },
                },
                {
                    destination: "typography.xml",
                    format: "android/resources",
                    filter: {
                        attributes: {
                            category: "typography",
                        },
                    },
                },
            ],
        },
    },
};
