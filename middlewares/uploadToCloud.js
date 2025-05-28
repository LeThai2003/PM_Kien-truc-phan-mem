const CloudinaryAdapter = require("../adapters/clouds/cloudinaryAdapter");
const UploadSingleStrategy = require("../strategies/uploads/uploadSingleStrategy");
const UploadFieldsStrategy = require("../strategies/uploads/uploadFieldsStrategy");

const cloudStorage = new CloudinaryAdapter({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const uploadSingle = new UploadSingleStrategy(cloudStorage);
const uploadFields = new UploadFieldsStrategy(cloudStorage);

module.exports = {
  uploadSingle: uploadSingle.handle.bind(uploadSingle),
  uploadFields: uploadFields.handle.bind(uploadFields),
}