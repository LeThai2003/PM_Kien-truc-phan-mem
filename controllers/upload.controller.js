
// [POST] /upload/image-single
module.exports.uploadImageSingle = async (req, res, next) => {
  try {
    res.json({message: "Upload image success", imageUrl: req.body.image});
  } catch (error) {
    next(error);
  }
}

// [POST] /upload/images
module.exports.uploadImages = async (req, res, next) => {
  try {
    res.json({message: "Upload images success", imagesUrl: req.body.gallery});
  } catch (error) {
    next(error);
  }
}