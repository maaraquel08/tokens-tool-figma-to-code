const fs = require("fs");
const path = require("path");
const { getNodeDetails, getFigmaStyles } = require("../utils/figma");

async function generateTypographyTokens() {
    try {
        console.log("🔍 Fetching styles from Figma...");
        const data = await getFigmaStyles();

        if (!data || !data.meta || !data.meta.styles) {
            throw new Error("No styles found in Figma response");
        }

        const textStyles = data.meta.styles.filter(
            (style) =>
                style.name.includes("Heading/") ||
                style.name.includes("Body/") ||
                style.name.includes("Label/") ||
                style.name.includes("Subheading/")
        );

        console.log(`📝 Found ${textStyles.length} typography styles`);

        const styleDetails = await Promise.all(
            textStyles.map(async (style) => {
                const nodeData = await getNodeDetails(style.node_id);
                return {
                    name: style.name,
                    style: nodeData?.nodes[style.node_id]?.document?.style,
                };
            })
        );

        const formattedStyles = {
            typography: {
                headings: {},
                body: {},
                labels: {},
                subheadings: {},
            },
        };

        styleDetails.forEach((style) => {
            if (!style || !style.name || !style.style) return;

            const name = style.name
                .replace(/🔵|🟢|🔴|🟠/g, "")
                .trim()
                .replace(/\//g, "-")
                .replace(/\s+/g, "-")
                .toLowerCase();

            const styleObject = {
                fontFamily: style.style.fontFamily,
                fontSize: `${style.style.fontSize}px`,
                fontWeight: style.style.fontWeight,
                letterSpacing:
                    style.style.letterSpacing !== undefined
                        ? `${style.style.letterSpacing}px`
                        : undefined,
                lineHeight: style.style.lineHeightPx
                    ? `${style.style.lineHeightPx}px`
                    : undefined,
                textDecoration: style.style.textDecoration,
                textCase: style.style.textCase,
            };

            // Remove undefined values
            Object.keys(styleObject).forEach(
                (key) =>
                    styleObject[key] === undefined && delete styleObject[key]
            );

            if (style.name.includes("Heading/")) {
                formattedStyles.typography.headings[name] = styleObject;
            } else if (style.name.includes("Body/")) {
                formattedStyles.typography.body[name] = styleObject;
            } else if (style.name.includes("Label/")) {
                formattedStyles.typography.labels[name] = styleObject;
            } else if (style.name.includes("Subheading/")) {
                formattedStyles.typography.subheadings[name] = styleObject;
            }
        });

        const outputDir = path.join(__dirname, "../../output/tokens");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputPath = path.join(outputDir, "typography.json");
        fs.writeFileSync(outputPath, JSON.stringify(formattedStyles, null, 2));

        console.log(
            "✅ Typography tokens have been exported to output/tokens/typography.json"
        );
        return true;
    } catch (error) {
        console.error("❌ Error generating typography tokens:", error.message);
        return false;
    }
}

// Add this line to execute the function when running the script directly
generateTypographyTokens();

module.exports = {
    generateTypographyTokens,
};
