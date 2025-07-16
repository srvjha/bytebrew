import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";

admin.initializeApp(); // ✅ Initialize only once here


// Connect to emulator only if running locally
if (process.env.FUNCTIONS_EMULATOR === "true") {
  admin.firestore().settings({
    host: "localhost:8080",
    ssl: false,
  });
}


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Firebase server is up and running 🔥");
});

app.get("/health-check", (req, res) => {
  res.send("Firebase server health is up and running 🔥");
});

import reportRoutes from "./routes/report.route";
import { errorHandler } from "./middleware/error.middleware";
app.use("/report", reportRoutes);
app.use(errorHandler);

export const api = functions.https.onRequest(app);
