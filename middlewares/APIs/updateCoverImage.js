const upload = require("multer-uploader");
const path = require("path");

function updateCoverImage(req, res, next) {
  try {
    const upload_dir = path.join(
      __dirname,
      `./../../public/uploads/${req.id}/cover`
    );
    const max_file_size = 1000000;
    const allowed_file_mime_type = ["image/png", "image/jpg", "image/jpeg"];

    const uploader = upload(
      upload_dir,
      max_file_size,
      allowed_file_mime_type
    ).any();

    uploader(req, res, (err) => {
      if (err) {
        next(err);
      } else {
        next();
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = updateCoverImage;
