const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

// Initial data
let totalRaised = 100; // Initial amount
const goalAmount = 1000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Set up EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve the main crowdfunding page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle contributions and redirect to details page
app.post("/contribute", (req, res) => {
    const contribution = parseFloat(req.body.contribution);

    if (!contribution || contribution <= 0) {
        return res.status(400).send("Invalid contribution amount.");
    }

    if (totalRaised + contribution > goalAmount) {
        return res.status(400).send(`We only need $${goalAmount - totalRaised}.`);
    }

    totalRaised += contribution;

    // Redirect to the money details page
    res.render("money-details", {
        contribution: contribution.toFixed(2),
        totalRaised: totalRaised.toFixed(2),
        goalAmount: goalAmount.toFixed(2),
    });
});

// Serve stakeholders details page
app.get("/stakeholders", (req, res) => {
    res.render("stakeholders", {
        stakeholders: [
            {
                name: "Hitesh (Crowdfunding Specialist)",
                responsibilities: [
                    "Project submissions",
                    "Goal tracking",
                    "Reward structures",
                ],
            },
            {
                name: "Mohan (Marketing Strategist)",
                responsibilities: [
                    "Email templates",
                    "Social media integration",
                    "Marketing strategies",
                ],
            },
            {
                name: "Govardhan (Community Engagement Coordinator)",
                responsibilities: [
                    "Forums and Q&A",
                    "Feedback systems",
                    "Community building",
                ],
            },
            {
                name: "Abhinav (Marketing Analyst)",
                responsibilities: [
                    "Analytics and reporting",
                    "Campaign performance metrics",
                    "Actionable insights",
                ],
            },
        ],
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
