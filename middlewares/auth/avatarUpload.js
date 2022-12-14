// Dependencies
const upload = require("multer-uploader");
const path = require("path");

function avatarUpload(req, res, next) {
  //directory
  const uploadDirectory = path.join(__dirname + "./../../temp/");
  // file size
  const maxFileSize = 10000000;
  // file type
  const allowedMimeType = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/svg+xml",
  ];

  upload(uploadDirectory, maxFileSize, allowedMimeType).single("avatarProfile")(
    req,
    res,
    (err) => {
      if (err) {
        const error = {
          avatarProfile: {
            msg: err?.message,
          },
        };
        req.error = error;
        next();
      } else {
        next();
      }
    }
  );
}

// Module Export
module.exports = avatarUpload;
