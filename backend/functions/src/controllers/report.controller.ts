import { validateReport } from "../schemas/report.schema";
import { Report } from "../types/report.type";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { handleZodError } from "../utils/handleZodError";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

const submitReport = asyncHandler(async (req, res) => {
  const { type, mediaUrl, geo, source, rawText } = handleZodError(
    validateReport(req.body)
  );

 const submittedAt = Timestamp.fromDate(new Date());
  const report: Report = {
    type,
    geo: {
      lat: geo.lat,
      lng: geo.lng,
    },
    source,
    rawText,
    submittedAt,
  };

  if (mediaUrl) {
    report.mediaUrl = mediaUrl;
  }

  const db = admin.firestore(); // ✅ Safe here after initializeApp
  await db.collection("reports").add(report);

  res.status(201).json(new ApiResponse(201, "Report Submitted", report));
});

export { submitReport };
