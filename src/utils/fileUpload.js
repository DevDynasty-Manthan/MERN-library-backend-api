import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  if (!localFilePath) return null;

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    try { fs.unlinkSync(localFilePath); } catch (e) {}
    console.log(response.secure_url)
    return response; // use response.secure_url in controller
    
  } catch (error) {
    console.log("Cloudinary upload error:", error);
    try { fs.unlinkSync(localFilePath); } catch (e) {}
    return null;
  }
};

export { uploadOnCloudinary };
