const router = require("express").Router();
const sql = require("../msdb");
const mariadb = require("../mariadb");
const mssql = require('mssql');
const authorize = require("../middleware/authorize");

function APILog(method,url)
{
    return console.log('HTTP '+method + ' Request from: ' + url)
}

router.get("/raw",authorize, async (req, res) => {
    const data = await sql.query("SELECT * from checkinout")
    console.log(data.rowsAffected)
    return res.send({
        res: data.recordsets
    })
})

router.get("/userid/:userid",authorize, async (req, res) => {
    //console.log(req)
    try {
        const data = await sql.request()
        .input('userid',mssql.VarChar,req.params.userid)
        .query("SELECT b.badgenumber,a.checktime,a.checktype,a.verifycode from checkinout a inner join userinfo b on a.userid = b.userid where b.badgenumber = @userid")
        APILog(req.route.stack[0].method,req.originalUrl)
        return res.send({
            res: data.recordsets
        })
    } catch (error) {
        //console.log(error.message)
    }
})

router.get("/datebetween/:userid/:start/:end",authorize, async (req, res) => {
    //console.log(req.params.userid)
    const data = await sql.query("SELECT b.badgenumber,a.checktime,a.checktype,a.verifycode from checkinout a inner join userinfo b on a.userid = b.userid where b.badgenumber = '"+req.params.userid+"' and a.checktime between '"+req.params.start+"' and dateadd(day,1,'"+req.params.end+"')")
    
    return res.send({
        res: data.recordsets
    })
})

router.get("/filodatebetween/:start/:end",authorize, async (req, res) => {
    //console.log(req.user)
    try {
        const data = await sql.query(`select
                b.BADGENUMBER,
                convert(date,a.CHECKTIME) Date, 
                Min(CASE WHEN a.CHECKTYPE = 'I' THEN a.CHECKTIME END) ClockIn,
                Min(CASE WHEN a.VERIFYCODE = '1' AND a.CHECKTYPE = 'I' THEN 'PRINT' WHEN a.VERIFYCODE = '4' AND a.CHECKTYPE = 'I' THEN 'CARD' WHEN a.VERIFYCODE = '15' AND a.CHECKTYPE = 'I' THEN 'FACIAL' END) ClockInType,
                Max(CASE WHEN a.CHECKTYPE = 'O' THEN a.CHECKTIME END) ClockOut,
                Max(CASE WHEN a.VERIFYCODE = '1' AND a.CHECKTYPE = 'O' THEN 'PRINT' WHEN a.VERIFYCODE = '4' AND a.CHECKTYPE = 'O' THEN 'CARD' WHEN a.VERIFYCODE = '15' AND a.CHECKTYPE = 'O' THEN 'FACIAL' END) ClockOutType
            from checkinout a inner join userinfo b on a.userid = b.userid where a.CHECKTIME between '${req.params.start}' and dateadd(day,1,'${req.params.end}') and b.badgenumber = '${req.user.id.idno}'
            Group by b.BADGENUMBER, convert(date,a.CHECKTIME)`)
    
    return res.send(data.recordsets[0])
    } catch (error) {
        
    }
    
})


module.exports = router;                                                                    