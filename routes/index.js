var express = require('express');
var router = express.Router();
var multer  = require('multer');
var upload = multer({ dest: './public/images' });
const db = require('../db');


//check the user out to lock down our app!
router.post('*',
  upload.single('locationImage'),
  (req, res, next)=>{
    const token = req.body.token
    const getUserIdQuery = `SELECT id FROM users WHERE token = ?`;
    db.query(getUserIdQuery,[token], (err, results)=>{
        if(results.length === 0){
            res.locals.loggedIn = false;
        }else{
          res.locals.loggedIn = true;
          res.locals.uid = results[0].id
        }
        next(); //send user on to next route
    })
})


router.get('/cities',(req, res, next)=>{
  const citiesQuery = `SELECT * FROM cities
    ORDER BY RAND()
    LIMIT 8`
  db.query(citiesQuery,(err, results)=>{
    if(err) throw err;
    res.json(results);
  })
})

router.get('/abodes',(req, res, next)=>{
  const abodesQuery = `SELECT * FROM homes
    ORDER BY RAND()
    LIMIT 8`
  db.query(abodesQuery,(err, results)=>{
    if(err) throw err;
    res.json(results);
  })
})

router.get('/abode/:abodeId',(req, res)=>{
  const abodeId = req.params.abodeId;
  const getAbodeQuery = `SELECT * FROM homes 
    WHERE id = ?`;
  db.query(getAbodeQuery,[abodeId],(err, result)=>{
    if(err) throw err;
    res.json(result[0])
  })
})

module.exports = router;
