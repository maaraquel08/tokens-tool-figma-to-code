require("dotenv").config();
const fetch = require("node-fetch");

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY;

async function getNodeDetails(nodeId) {
    try {
        const response = await fetch(
            `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/nodes?ids=${nodeId}`,
            {
                headers: {
                    "X-Figma-Token": FIGMA_ACCESS_TOKEN,
                },
            }
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching node details:", error);
        return null;
    }
}

async function getFigmaStyles() {
    try {
        const response = await fetch(
            `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/styles`,
            {
                headers: {
                    "X-Figma-Token": FIGMA_ACCESS_TOKEN,
                },
            }
        );
        return response.json();
    } catch (error) {
        console.error("Error fetching Figma styles:", error);
        return null;
    }
}

module.exports = {
    getNodeDetails,
    getFigmaStyles,
};
