const router = require("express").Router();
const sql = require("../msdb");
const mariadb = require("../mariadb");
const mssql = require('mssql');
const authorize = require("../middleware/authorize");

function APILog(method,url)
{
    return console.log('HTTP '+method + ' Request from: ' + url)
}

/* router.get("/getdetails/:code", async (req, res) => {
    //console.log(req.params.userid)
    const data = await sql.query("SELECT * from transactiontype where code = '"+req.params.code+"' and active =1")
    
    return res.send({
        res: data.recordsets
    })
}) */

module.exports = router;                                                                    