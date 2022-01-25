const router = require("express").Router();
const sql = require("../msdb");
const mariadb = require("../mariadb");
const mssql = require('mssql');
const authorize = require("../middleware/authorize");
const moment = require("moment");

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
    try {
        const data = await sql.query("SELECT b.badgenumber,a.checktime,a.checktype,a.verifycode from checkinout a inner join userinfo b on a.userid = b.userid where b.badgenumber = '"+req.params.userid+"' and a.checktime between '"+req.params.start+"' and dateadd(day,1,'"+req.params.end+"')")
    
        return res.send({
            res: data.recordsets
        })
        
    } catch (error) {
        
    }
    
})

router.get("/filodatebetween/:start/:end",authorize, async (req, res) => {
    //console.log(req.user)
    try {
        /* const data = await sql.query(`select
                b.BADGENUMBER,
                convert(date,a.CHECKTIME) Date, 
                Min(CASE WHEN a.CHECKTYPE = 'I' THEN a.CHECKTIME END) ClockIn,
                Min(CASE WHEN a.VERIFYCODE = '1' AND a.CHECKTYPE = 'I' THEN 'PRINT' WHEN a.VERIFYCODE = '4' AND a.CHECKTYPE = 'I' THEN 'CARD' WHEN a.VERIFYCODE = '15' AND a.CHECKTYPE = 'I' THEN 'FACIAL' WHEN a.VERIFYCODE = '1518' AND a.CHECKTYPE = 'I' THEN 'OB' END) ClockInType,
                Max(CASE WHEN a.CHECKTYPE = 'O' THEN a.CHECKTIME END) ClockOut,
                Max(CASE WHEN a.VERIFYCODE = '1' AND a.CHECKTYPE = 'O' THEN 'PRINT' WHEN a.VERIFYCODE = '4' AND a.CHECKTYPE = 'O' THEN 'CARD' WHEN a.VERIFYCODE = '15' AND a.CHECKTYPE = 'O' THEN 'FACIAL' WHEN a.VERIFYCODE = '1518' AND a.CHECKTYPE = 'O' THEN 'OB' END) ClockOutType
            from checkinout a inner join userinfo b on a.userid = b.userid where a.CHECKTIME between '${req.params.start}' and dateadd(day,1,'${req.params.end}') and b.badgenumber = '${req.user.id.idno}'
            Group by b.BADGENUMBER, convert(date,a.CHECKTIME)`) */

        const data = await sql.query(`select
            b.BADGENUMBER,
            convert(date,a.CHECKTIME) Date, 
            Min(CASE WHEN a.CHECKTYPE = 'I' THEN a.CHECKTIME END) ClockIn,
            Max(CASE WHEN a.CHECKTYPE = 'O' THEN a.CHECKTIME END) ClockOut,
            c.details,
            d.description
            from checkinout a inner join userinfo b on a.userid = b.userid 
            full outer join Request c on a.sn = c.transno  
            full outer join transactiontype d on a.VERIFYCODE = d.code
            where a.CHECKTIME between '${req.params.start}' and dateadd(day,1,'${req.params.end}') and b.badgenumber = '${req.user.id.idno}' and a.WORKCODE = 0
            Group by b.BADGENUMBER, convert(date,a.CHECKTIME),c.details,d.description
            Order by Date,ClockIn`)
    
    return res.send(data.recordsets[0])
    } catch (error) {
        
    }
    
})

router.get("/getdetails/:userid/:checktime", async (req, res) => {
    let desc;
    let det;
    try {
        const userid = await sql.query("SELECT * from USERINFO where BADGENUMBER = '"+req.params.userid+"'")
        const data = await sql.query("SELECT * from CHECKINOUT where USERID = "+userid.recordsets[0][0].USERID+" and CHECKTIME = '"+req.params.checktime+"'")
        const ttype = await sql.query("SELECT * from transactiontype where code = "+data.recordsets[0][0].VERIFYCODE+" and active = 1")
        
        //console.log(data.recordsets[0][0].UserExtFmt)

        if(data.recordsets[0][0].UserExtFmt == 0)
        {
            const details = await sql.query("SELECT * from Request where transno = '"+data.recordsets[0][0].sn+"' and idno = '"+req.params.userid+"'")
            desc = ttype.recordsets[0][0].description;
            det = details.recordsets[0][0].details;
        }
        else
        {
            desc = 'Biometrics';
            det = 'Office';
        }
        return res.send({
            type: desc,
            details: det,
        })
    } catch (error) {
        
    }
})

router.get("/filodatebetween2/:idno/:start/:end", async (req, res) => {
    //console.log(req.user)
    let data = [];
    try {
        const data = await sql.query(`select
                b.BADGENUMBER,
                convert(date,a.CHECKTIME) Date, 
                Min(CASE WHEN a.CHECKTYPE = 'I' THEN a.CHECKTIME END) ClockIn,
                Min(CASE WHEN a.VERIFYCODE = '1' AND a.CHECKTYPE = 'I' THEN 'PRINT' WHEN a.VERIFYCODE = '4' AND a.CHECKTYPE = 'I' THEN 'CARD' WHEN a.VERIFYCODE = '15' AND a.CHECKTYPE = 'I' THEN 'FACIAL' WHEN a.VERIFYCODE = '1518' AND a.CHECKTYPE = 'I' THEN 'OB' END) ClockInType,
                Max(CASE WHEN a.CHECKTYPE = 'O' THEN a.CHECKTIME END) ClockOut,
                Max(CASE WHEN a.VERIFYCODE = '1' AND a.CHECKTYPE = 'O' THEN 'PRINT' WHEN a.VERIFYCODE = '4' AND a.CHECKTYPE = 'O' THEN 'CARD' WHEN a.VERIFYCODE = '15' AND a.CHECKTYPE = 'O' THEN 'FACIAL' WHEN a.VERIFYCODE = '1518' AND a.CHECKTYPE = 'O' THEN 'OB' END) ClockOutType
            from checkinout a inner join userinfo b on a.userid = b.userid where a.CHECKTIME between '${req.params.start}' and dateadd(day,1,'${req.params.end}') and b.badgenumber = '${req.params.idno}'
            Group by b.BADGENUMBER, convert(date,a.CHECKTIME)`)
    
     /*        let desc;
    let det;
    const userid = await sql.query("SELECT * from USERINFO where BADGENUMBER = '"+req.params.idno+"'")
    
    
    for (let i = 0; i < data.recordsets[0].length; i++) {
        console.log(moment(data.recordsets[0][i].ClockIn).subtract(8,'h').format("YYYY-MM-DD HH:mm:ss"))
        const data2 = await sql.query("SELECT * from CHECKINOUT where USERID = "+userid.recordsets[0][0].USERID+" and CHECKTIME in ('"+moment(data.recordsets[0][i].ClockIn).subtract(8,'h').format("YYYY-MM-DD HH:mm:ss")+"','"+moment(data.recordsets[0][i].Clock).subtract(8,'h').format("YYYY-MM-DD HH:mm:ss")+"'")
        const ttype = await sql.query("SELECT * from transactiontype where code = "+data2.recordsets[0][0].VERIFYCODE+" and active = 1")
        
        //console.log(data.recordsets[0][0].UserExtFmt)

        if(data.recordsets[0][0].UserExtFmt == 0)
        {
            const details = await sql.query("SELECT * from Request where transno = '"+data.recordsets[0][0].sn+"' and idno = '"+req.params.userid+"'")
            desc = ttype.recordsets[0][0].description;
            det = details.recordsets[0][0].details;
        }
        else
        {
            desc = 'Biometrics';
            det = 'Office';
        }
            
    } */
    
    return res.send(data.recordsets[0])
    } catch (error) {
        
    }
    
})


module.exports = router;                                                                    