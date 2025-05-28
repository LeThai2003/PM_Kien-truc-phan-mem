const {v2: cloudinary} = require("cloudinary");
const streamifier = require("streamifier");

class CloudinaryAdapter{
  constructor(config){
    cloudinary.config(config);
  }

  upload(buffer){
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if(result) resolve(result.url);
        else reject(error);
      });

      streamifier.createReadStream(buffer).pipe(stream);
    })
  }
}

module.exports = CloudinaryAdapter;