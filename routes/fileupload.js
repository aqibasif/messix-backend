const path = require('path');
const express = require('express');
const multer = require('multer');
const app = express();
const router = express.Router();

app.use(express.static(__dirname + '../../Beverix-app/fyp/public/uploads'));

var storage = multer.diskStorage({
    destination: '../../Beverix-app/fyp/public/uploads',
  
    filename: function (req, file, callback) {
  
      callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  })

// const storage = multer.diskStorage({
//   destination: '../../Beverix-app/fyp/public/uploads',
//   //         function (req, file, cb) {
//   //     cb(null, path.resolve(__dirname,'../../fyp/public/uploads'));
//   //   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// var upload = multer({ storage: storage });

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});


router.post('/',  upload.single('photo'),  (req, res, next) => {
 
  console.log(req.file.path.substr(28));
//   return  res.json({
//     image: req.file.path,
//   });

    const image = req.file.path.substr(28);
    res.send(image);
});

module.exports = router;
