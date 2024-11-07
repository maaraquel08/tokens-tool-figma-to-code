const express = require("express");
const app = express();

app.use(express.json());

const { generateTypographyTokens } = require("../scripts/typography");

app.post("/webhook", async (req, res) => {
    try {
        console.log("🎉 Webhook received!");
        console.log("Payload:", JSON.stringify(req.body, null, 2));

        console.log("Starting typography token generation...");
        await generateTypographyTokens();

        console.log("✅ Webhook processed successfully");
        res.status(200).send("Webhook processed successfully");
    } catch (error) {
        console.error("❌ Webhook error:", error);
        res.status(500).send("Error processing webhook");
    }
});

// Add a test endpoint
app.get("/test", (req, res) => {
    console.log("Test endpoint hit");
    res.status(200).send("Webhook server is running");
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`
=================================
🚀 Server running on port ${PORT}
Test endpoint: http://localhost:${PORT}/test
=================================
  `);
});
