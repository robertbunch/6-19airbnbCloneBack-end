var express = require('express');
var router = express.Router();
const db = require('../db');
var multer  = require('multer');
var upload = multer({ dest: './public/images' });
const fs = require('fs');

//    post('/host/homes')
router.post('/homes',
  upload.single('locationImage'),
  (req, res)=>{
    console.log(req.body);
    console.log(req.file);

    const f = req.file;
    const finalFilePath = f.destination+'/'+Date.now()+f.originalname;
    fs.rename(f.path, finalFilePath,(err)=>{
        if(err) throw err;
    })
    console.log(finalFilePath)


    res.json(req.body);
});

module.exports = router;
