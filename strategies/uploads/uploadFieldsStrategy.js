class UploadFieldsStrategy{
  constructor(storage){
    this.storage = storage;
  }

  async handle(req, res, next){
    try {
      if(req.files){
        for (const key in req.files) {
          req.body[key] = [];
          for (const file of req.files[key]) {
            const url = await this.storage.upload(file.buffer);
            req.body[key].push(url);
          }
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UploadFieldsStrategy;