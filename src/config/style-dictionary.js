const StyleDictionary = require("style-dictionary");

// Register a custom transform to handle references
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

// CSS Variables formatter
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

// Tailwind theme formatter
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
    },
};
