import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError";
import { logger } from "firebase-functions";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    logger.info("File is Uploaded Succesfully on CLoudnary!!!", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error:any) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    logger.error(`Failed to upload on cloudinary ${error}`)
    throw new ApiError(500,`Failed to upload on cloudinary ${error.message}`);
  }
};

export { uploadOnCloudinary };
