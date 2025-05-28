class UploadSingleStrategy{
  constructor(storage){
    this.storage = storage;
  }

  async handle(req, res, next){
    try {
      if(req.file){
        const url = await this.storage.upload(req.file.buffer);
        req.body[req.file.fieldname] = url;
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UploadSingleStrategy;