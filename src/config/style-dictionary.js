const StyleDictionary = require("style-dictionary");

// Register custom transforms
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

// Color transform for Android
StyleDictionary.registerTransform({
    name: "color/android",
    type: "value",
    matcher: (token) => token.path[0] === "color",
    transformer: (token) => {
        // Convert hex to android color format
        const hexToAndroid = (hex) => {
            return hex.replace("#", "").toUpperCase();
        };
        return {
            light: hexToAndroid(token.value.light),
            dark: hexToAndroid(token.value.dark),
        };
    },
});

// Color transform for iOS
StyleDictionary.registerTransform({
    name: "color/ios",
    type: "value",
    matcher: (token) => token.path[0] === "color",
    transformer: (token) => {
        // Convert hex to UIColor format
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

// Existing CSS Variables formatter
StyleDictionary.registerFormat({
    name: "css/variables",
    formatter: function ({ dictionary }) {
        const variables = dictionary.allTokens
            .map((token) => {
                const type = token.path[1];
                const path = token.path.slice(2).join("-");
                const cssVariable = `--color-${type}-${path}`;

                return `  ${cssVariable}: ${token.value.light};`;
            })
            .join("\n");

        const darkVariables = dictionary.allTokens
            .map((token) => {
                const type = token.path[1];
                const path = token.path.slice(2).join("-");
                const cssVariable = `--color-${type}-${path}`;

                return `  ${cssVariable}: ${token.value.dark};`;
            })
            .join("\n");

        return `:root {\n${variables}\n}\n\n[data-theme="dark"] {\n${darkVariables}\n}`;
    },
});

// Existing Tailwind formatter
StyleDictionary.registerFormat({
    name: "javascript/tailwind",
    formatter: function ({ dictionary }) {
        // Helper function to build color structure based on type
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
                // Text colors from color.text.*
                textColor: buildColorStructure("text"),
                // Background colors from color.background.*
                backgroundColor: buildColorStructure("background"),
                // Border colors from color.border.*
                borderColor: buildColorStructure("border"),
            },
        };

        return `module.exports = ${JSON.stringify(theme, null, 2)}`;
    },
});

// Android Colors XML formatter
StyleDictionary.registerFormat({
    name: "android/colors",
    formatter: function ({ dictionary }) {
        const colorResources = dictionary.allTokens
            .map((token) => {
                const type = token.path[1];
                const path = token.path.slice(2).join("_");
                const resourceName = `color_${type}_${path}`;

                return (
                    `    <color name="${resourceName}_light">@{${token.value.light}}</color>\n` +
                    `    <color name="${resourceName}_dark">@{${token.value.dark}}</color>`
                );
            })
            .join("\n");

        return (
            `<?xml version="1.0" encoding="utf-8"?>\n` +
            `<resources>\n${colorResources}\n</resources>`
        );
    },
});

// iOS Swift formatter
StyleDictionary.registerFormat({
    name: "ios/swift",
    formatter: function ({ dictionary }) {
        const colorExtension = dictionary.allTokens
            .map((token) => {
                const type = token.path[1];
                const path = token.path.slice(2).join("_");
                const varName = `${type}_${path}`;

                return (
                    `    static var ${varName}: UIColor {\n` +
                    `        if #available(iOS 13.0, *) {\n` +
                    `            return UIColor { traitCollection in\n` +
                    `                switch traitCollection.userInterfaceStyle {\n` +
                    `                case .dark:\n` +
                    `                    return ${token.value.dark}\n` +
                    `                default:\n` +
                    `                    return ${token.value.light}\n` +
                    `                }\n` +
                    `            }\n` +
                    `        } else {\n` +
                    `            return ${token.value.light}\n` +
                    `        }\n` +
                    `    }`
                );
            })
            .join("\n\n");

        return `import UIKit\n\n` + `extension UIColor {\n${colorExtension}\n}`;
    },
});

module.exports = {
    source: ["src/tokens/colors.json", "src/tokens/semantic-colors.json"],
    platforms: {
        css: {
            transformGroup: "css",
            transforms: [
                "attribute/cti",
                "name/cti/kebab",
                "time/seconds",
                "content/icon",
                "size/rem",
                "color/css",
                "resolve/color",
            ],
            buildPath: "dist/css/",
            files: [
                {
                    destination: "tokens.css",
                    format: "css/variables",
                },
            ],
        },
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
            ],
        },
        android: {
            transformGroup: "android",
            transforms: [
                "attribute/cti",
                "name/cti/snake",
                "color/android",
                "resolve/color",
            ],
            buildPath: "dist/android/",
            files: [
                {
                    destination: "colors.xml",
                    format: "android/colors",
                },
            ],
        },
        ios: {
            transformGroup: "ios",
            transforms: [
                "attribute/cti",
                "name/cti/camel",
                "color/ios",
                "resolve/color",
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
