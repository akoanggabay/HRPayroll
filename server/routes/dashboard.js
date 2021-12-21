const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../mariadb");

router.post("/", authorize, async (req, res) => {
  try {
    //console.log(req.user.id.idno)
    //console.log(req.user.id.com)

    await pool.query("SELECT * FROM user WHERE idno = ? and company = ? and active = 1", [req.user.id.idno,req.user.id.com],async function(err, result, fields){ 


      res.json(
        {
          idno: result[0].idno,
          fname: result[0].fname,
          com: result[0].company,
          lname: result[0].lname
        }
      );

    });
    
  //if would be req.user if you change your payload to this:
    
  //   function jwtGenerator(user_id) {
  //   const payload = {
  //     user: user_id
  //   };
    
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;