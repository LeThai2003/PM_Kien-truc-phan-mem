const express = require("express");
const multer = require("multer");
const {uploadSingle, uploadFields} = require("../middlewares/uploadToCloud");
const UploadController = require("../controllers/upload.controller");

const router = express.Router();
const upload = multer();

router.post("/image-single", upload.single("image"), uploadSingle, UploadController.uploadImageSingle);

router.post("/images", upload.fields([{name: "gallery", maxCount: 5}]), uploadFields, UploadController.uploadImages);

module.exports = router;