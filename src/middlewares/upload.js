const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

const createUpload = (folderName) => {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: folderName,
        allowed_formats: ["jpg", "jpeg", "png"],
      },
    });
  
    return multer({ storage });
  };



module.exports = createUpload;
