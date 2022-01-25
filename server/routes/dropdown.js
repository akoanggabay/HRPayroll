const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../mariadb");
const validInfo = require("../middleware/validInfo");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authorize");
const sql = require("../msdb");

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

router.get("/leave", authorize ,async (req, res) => {
  try {

      const data = await sql.request()
        .query("SELECT * from leave order by description")

        
        //console.log(data.recordsets[0])
        return res.send({
            res: data.recordsets[0]
        })
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

router.get("/dept", authorize ,async (req, res) => {
  try {
      //console.log(req.user.id.com)
      const data = await sql.request()
        .query("SELECT * from approver where ccode = '"+req.user.id.com+"' order by dept")

        
        //console.log(data.recordsets[0])
        return res.send({
            res: data.recordsets[0]
        })
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

router.get("/transaction", authorize ,async (req, res) => {
  try {

      const data = await sql.request()
        .query("SELECT * from transactiontype where active = 1 order by description")

        
        //console.log(data.recordsets[0])
        return res.send({
            res: data.recordsets[0]
        })
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

router.get("/form", authorize ,async (req, res) => {
  try {
      //console.log(req.user.id.com)
      const data = await sql.request()
        .query("SELECT * from formtype where active = 1 and ccode = '"+req.user.id.com+"' order by description")

        
        //console.log(data.recordsets[0])
        return res.send({
            res: data.recordsets[0]
        })
  
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
});

module.exports = router;
