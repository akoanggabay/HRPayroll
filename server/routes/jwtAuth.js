const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../mariadb");
const validInfo = require("../middleware/validInfo");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authorize");

//authorizeentication
pool.connect((error) => {
  if (error) throw error;
  else console.log("Connected to Maria DB!");
});

router.post("/login", validInfo, async (req, res) => {
  const { idno, com, password } = req.body;
  
  try {
    await pool.query("SELECT * FROM user WHERE idno = ? and company = ? and active = 1", [idno,com],async function(err, result, fields){
    
      /* console.log(result.length)
      console.log(result) */
      if (result.length < 1) {
        return res.status(401).json("Id number doesn't exist!");
      }

      const hash = result[0].password.replace(/^\$2y(.+)$/i, '$2a$1');
      await bcrypt.compare(password, hash, function(err, resdata) {
        //console.log(resdata);

        if (resdata === false) {
          return res.status(401).json("Invalid Password");
        }
        const jwtToken = jwtGenerator(
          {
            idno: result[0].idno,
            com: result[0].company
          }
        );
        return res.json(
          { 
            jwtToken: jwtToken,
            idno: result[0].idno,
            fname: result[0].fname,
            com: result[0].company,
            lname: result[0].lname
          }
        );
      });
      
      /* return res.status(200).send({
        idno: result[0].idno,
        password: result[0].password
      }) */
    });
    
    /* 
    const hash = user.rows[0].password.replace(/^\$2y(.+)$/i, '$2a$1');
    const validPassword = await bcrypt.compare(password, hash, function(err, res) {
      console.log(res);
    });

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }
    const jwtToken = jwtGenerator(user.rows[0].user_id);
    return res.json({ jwtToken }); */
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
