var express = require('express');
var router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
const randToken = require('rand-token');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup',(req, res, next)=>{
  // someone wants to signup!! im so excited!!
  // First of all... Check to see if data is valid
  const { first,last,email,password } = req.body;
  if((!first) || (!last) || (!email) || (!password)){
    // STOP. Goodbye.
    res.json({
      msg: "invalidData"
    });
    return;
  }
  // if we get this far, the data is valid. See if the user is in the db
  const checkUserQuery = `SELECT * FROM users WHERE email = ?`
  db.query(checkUserQuery,[email],(err,results)=>{
    if(err){throw err}; //FULL STOP!!!!!
    if(results.length > 0){
      // this email has been used. Goodbye.
      res.json({
        msg: "userExists"
      });
    }else{
      // this email has not been used. lets add it
      const insertUserQuery = `INSERT INTO users
        (first, last, email, password, token)
        VALUES
        (?,?,?,?,?)`
        // turn the password into something evil for db storage
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const token = randToken.uid(50); // this is the users valet ticket
        db.query(insertUserQuery,[first,last,email,hash,token],(err2)=>{
          if(err2){throw err2}
          // Hooray!
          res.json({
            msg: "userAdded",
            token,
            email,
            first
          })
        });
    }
  })
})

router.post('/login',(req, res)=>{
  const { email, password } = req.body;
  // First: Check db for this email
  const getUserQuery = `SELECT * FROM users WHERE email = ?`;
  db.query(getUserQuery,[email],(err, results)=>{
    if(err){throw err}
    // check to see if there is a result
    if(results.length > 0){
      // found them!!!!
      const thisRow = results[0];
      // find out if the pass is correct
      const isValidPass = bcrypt.compareSync(password,thisRow.password);
      if(isValidPass){
        // these are the droids we're looking for
        const token = randToken.uid(50); // this is the users valet ticket
        const updateUserTokenQuery = `UPDATE users
          SET token = ? WHERE email = ?`
        db.query(updateUserTokenQuery,[token,email],(err)=>{
          if(err){throw err}
        });

        res.json({
          msg: "loggedIn",
          first: thisRow.first,
          email: thisRow.email,
          token
        });
      }else{
        // lier lier, pants on fire
        res.json({
          msg: "badPass"
        })
      }

    }else{
      // no match
      res.json({
        msg: "noEmail"
      })
    }
  })
})

module.exports = router;
