import { validateReport } from "../schemas/report.schema";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { handleZodError } from "../utils/handleZodError";
import * as admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { getGeminiAnalysis } from "../utils/agent";

const citizenReporting = asyncHandler(async (req, res) => {
  const { description, latitude, longitude, userId } = handleZodError(
    validateReport(req.body)
  );
  let photoMediaUrls: (string | null)[] = [];
  let videoMediaUrls: (string | null)[] = [];
  if (req.files && !Array.isArray(req.files)) {
    const photos = req.files["photos"];
    const videos = req.files["videos"];

    if (photos && photos.length > 0) {
      photoMediaUrls = await Promise.all(
        photos.map(async (photo) => {
          const result = await uploadOnCloudinary(photo.path);
          return result?.secure_url ?? null;
        })
      );
    }

    if (videos && videos.length > 0) {
      videoMediaUrls = await Promise.all(
        videos.map(async (video) => {
          const result = await uploadOnCloudinary(video.path);
          return result?.secure_url ?? null;
        })
      );
    }
  }

  const analysis = await getGeminiAnalysis({
    photoMediaUrls,
    videoMediaUrls,
    text: description,
    coordinates: { latitude, longitude },
  });

  const eventRecord = {
    description,
    latitude: Number(latitude),
    longitude: Number(longitude),
    userId,
    timestamp: Timestamp.fromDate(new Date()),
    photoMediaUrls,
    videoMediaUrls,
    aiCategory: analysis.category,
    aiSummary: analysis.summary,
    aiEntities: analysis.entities,
    aiUrgency: analysis.urgency,
  };

  const db = admin.firestore();
  await db.collection("citizen_reports").add(eventRecord);

  return res
    .status(201)
    .json(
      new ApiResponse(200, "Citizen report submitted successfully", eventRecord)
    );
});

export { citizenReporting };
