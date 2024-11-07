require("dotenv").config();
const fetch = require("node-fetch");

async function setupFigmaWebhook() {
    try {
        const response = await fetch(`https://api.figma.com/v1/webhooks`, {
            method: "POST",
            headers: {
                "X-Figma-Token": process.env.FIGMA_ACCESS_TOKEN,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                event_type: "FILE_UPDATE",
                team_id: process.env.FIGMA_TEAM_ID,
                endpoint: process.env.WEBHOOK_URL,
                passcode: process.env.FIGMA_WEBHOOK_PASSCODE,
                description: "Typography tokens sync",
            }),
        });

        const data = await response.json();
        console.log("Webhook setup response:", data);
    } catch (error) {
        console.error("Error setting up webhook:", error);
    }
}

setupFigmaWebhook();
