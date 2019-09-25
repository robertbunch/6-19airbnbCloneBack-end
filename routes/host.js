var express = require('express');
var router = express.Router();
const db = require('../db');

//    post('/host/homes')
router.post('/homes',(req, res)=>{
    console.log(req.body);
    res.json(req.body);
});

module.exports = router;
