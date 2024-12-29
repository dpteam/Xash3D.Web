import { init, start, fullscreen } from "./lib/hl-engine.js";

let zipFile;

document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const startBtn = document.getElementById("startBtn");
    const zipInput = document.getElementById("zipInput");
    const gamedirInput = document.getElementById("gamedir");
    const widthInput = document.getElementById("width");
    const heightInput = document.getElementById("height");

    // Initialize the engine
    init({
        canvas,
        location: "lib",
        setStatus: (text) => {
            document.getElementById("output").value += `${text}\n`;
        },
    });

    // Handle ZIP file selection
    loadZipBtn.addEventListener("click", () => {
        zipInput.click();
    });

    zipInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const reader = new FileReader();
            reader.onload = () => {
                zipFile = reader.result;
                startBtn.disabled = false; // Enable the Start button
            };
            await new Promise((resolve) => reader.readAsArrayBuffer(file));
        } catch (error) {
            console.error("Error reading file:", error);
        }
    });

    // Start the game
    startBtn.addEventListener("click", async () => {
        if (!zipFile) return;

        const gamedir = gamedirInput.value.trim() || "valve";
        const width = Number(widthInput.value) || 1280;
        const height = Number(heightInput.value) || 720;

        start({
            zip: zipFile,
            mod: gamedir,
            map: "",
            args: [`-width`, String(width), `-height`, String(height)],
        });
    });

    // Fullscreen functionality
    document.getElementById("fullscreenBtn").addEventListener("click", () => {
        if (!startBtn.disabled) {
            fullscreen();
            document.body.requestFullscreen();
        } else {
            document.exitFullscreen().then(() => {
                startBtn.disabled = true;
                document.getElementById("gameCanvas").style.display = "block";
            });
        }
    });
});
