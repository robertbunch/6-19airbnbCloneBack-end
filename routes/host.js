var express = require('express');
var router = express.Router();
const db = require('../db');
var multer  = require('multer')
var upload = multer({ dest: './public/images' })
const fs = require('fs');

//    post('/host/homes')
router.post('/homes',upload.single('locationImage'),(req, res)=>{
    console.log(req.body);
    console.log(req.file);

    const f = req.file;
    fs.rename(f.path, f.destination+'/'+f.originalname,(err)=>{
        if(err) throw err;
    })

    res.json(req.body);
});

module.exports = router;
