console.log("🟡 Starting server...");

const express = require("express");
const { exec } = require('child_process');
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ CORS middleware with preflight support
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
}));

app.options("*", cors()); // Explicit preflight handler
app.use(express.json());

// ✅ Routes
const barRoutes = require("./routes/barRoutes");
const topBarRoutes = require("./routes/topBarRoutes");

app.use("/api/barvisits", barRoutes);
app.use("/api/topbars", topBarRoutes);


// ✅ Check if port is available and kill existing process if needed
function killPortProcess(port) {
    return new Promise((resolve) => {
        exec(`lsof -ti:${port}`, (error, stdout) => {
            if (stdout) {
                const pid = stdout.trim();
                console.log(`🔄 Killing existing process on port ${port} (PID: ${pid})`);
                exec(`kill -9 ${pid}`, () => {
                    setTimeout(resolve, 1000); // Wait 1 second after killing
                });
            } else {
                resolve();
            }
        });
    });
}

// ✅ MongoDB connection and server startup
async function startServer() {
    try {
        // Kill any existing process on the port
        await killPortProcess(PORT);

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");

        // Start the server
        const server = app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`❌ Port ${PORT} is already in use. Please kill the process or use a different port.`);
                process.exit(1);
            } else {
                console.error('❌ Server error:', err);
            }
        });
    } catch (err) {
        console.error("❌ Server startup error:", err);
        process.exit(1);
    }
}

startServer();
