import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import express from "express";

admin.initializeApp({
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

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


app.use(express.static("public"));


import reportRoutes from "./routes/report.route";
import { errorHandler } from "./middleware/error.middleware";

app.use("/report", reportRoutes);
app.use(errorHandler);

export const api = functions
  .runWith({ memory: '1GB', timeoutSeconds: 540 })
  .https.onRequest(app);
