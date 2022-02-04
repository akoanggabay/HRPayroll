const router = require("express").Router();
const sql = require("../msdb");
const mariadb = require("../mariadb");
const mssql = require('mssql');
const authorize = require("../middleware/authorize");

function APILog(method,url)
{
    return console.log('HTTP '+method + ' Request from: ' + url)
}

router.get("/getprofile",authorize, async (req, res) => {
    //console.log(req.params.userid)
    try {
        const data = await sql.query("SELECT * from USERINFO where BADGENUMBER = '"+req.user.id.idno+"'")
    
        return res.send({
            res: data.recordsets
        })
    } catch (error) {
        
    }
})

router.post("/saveprofile",authorize, async (req, res) => {
    //console.log(req.body)
    try {
        const data = await sql.query("UPDATE USERINFO set NAME = '"+req.body.name+"', POSITION = '"+req.body.title+"', HIREDDAY = '"+req.body.datehired+"', DEPT = '"+req.body.dept+"' where BADGENUMBER = '"+req.user.id.idno+"'")
    
        if(data.rowsAffected[0] > 0)
        {
            return res.send('Successfully Updated!')
        }
        else
        {
            return res.status(505).send('Cannot process transaction!')
        }
    } catch (error) {
        
    }
})

module.exports = router;                                                                    