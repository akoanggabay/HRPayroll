const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../mariadb");
const validInfo = require("../middleware/validInfo");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authorize");

//authorizeentication
/* pool.connect((error) => {
  if (error) throw error;
  else console.log("Connected to Maria DB!");
}); */

router.get("/company", async (req, res) => {
    try {
        await pool.query("SELECT * FROM company order by cname", function(err, result, fields){
        
          //console.log(result.length)
    
          return res.json(result);
        });
    
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
      }
});

module.exports = router;
