const router = require("express").Router();
const sql = require("../msdb");
const mariadb = require("../mariadb");
const mssql = require('mssql');
const validInfo = require("../middleware/validInfo");
const authorize = require("../middleware/authorize");
const zeroPad = (num, places) => String(num).padStart(places, '0');

function APILog(method,url)
{
    return console.log('HTTP '+method + ' Request from: ' + url)
}

// Start OT API Request ----------------------------------------

router.post("/otaddrequest", validInfo, authorize, async (req, res) => {
    //console.log(req.body)
    
    let lastOTreq;
    //console.log(lastOTreq)
    try {
        const lastOT = await sql.query("SELECT transno FROM OTRequest where transno like 'OT"+new Date().getFullYear()+"%' order by transno desc");

        if(lastOT.rowsAffected[0] > 0)
        {
            
            console.log(parseInt(lastOT.recordsets[0][0].transno.substring(6,11)) + 1)
            lastOTreq = "OT"+new Date().getFullYear() + zeroPad(parseInt(lastOT.recordsets[0][0].transno.substring(6,11)) + 1, 5).toString()
        }
        else
        {
            console.log("wala")
            lastOTreq = "OT"+new Date().getFullYear() + zeroPad(1, 5).toString();
        }
    
        const data = await sql.request()
        .input('transno',mssql.VarChar,lastOTreq)
        .input('idno',mssql.VarChar,req.body.idno)
        .input('ccode',mssql.VarChar,req.body.com)
        .input('date',mssql.Date,req.body.date)
        .input('starttime',mssql.VarChar,req.body.start)
        .input('endtime',mssql.VarChar,req.body.end)
        .input('details',mssql.VarChar,req.body.details)
        .input('remarks',mssql.VarChar,req.body.remarks)
        .input('status',mssql.VarChar,"FILED")
        .input('approver',mssql.VarChar,"1ST LEVEL")
        .query("INSERT into OTRequest (transno,idno,ccode,date,starttime,endtime,details,remarks,status,approver,datefiled,lastupdate) values (@transno,@idno,@ccode,@date,@starttime,@endtime,@details,@remarks,@status,@approver,GETDATE(),GETDATE()) ")
        APILog(req.route.stack[0].method,req.originalUrl)
        
        if(data.rowsAffected[0] > 0 )
        {
            return res.send({
                res: data.recordsets,
                status: 200,
                alert: "OT Request Sucessfully submitted!"
            })
        }
        else
        {
            return res.status(505).send({
                status: 505,
                alert: "Cannot process your request! Please refresh your browser and try again."
            })
        }
        
    } catch (error) {
        console.log(error.message)
        return res.status(505).send({
                status: 505,
                alert: "Cannot process your request! Please refresh your browser and try again."
            })
    }
});

router.get("/otgetallrequest", authorize, async (req, res) => {
    //console.log(req.params)
    try {
        const data = await sql.request()
        .input('idno',mssql.VarChar,req.user.id.idno)
        .input('ccode',mssql.VarChar,req.user.id.com)
        .query("SELECT * from OTRequest where idno = @idno and ccode= @ccode")
        APILog(req.route.stack[0].method,req.originalUrl)
        
        //console.log(data.recordsets[0])
        return res.send({
            res: data.recordsets[0]
        })
    } catch (error) {
        console.log(error.message)
    }
})

// End OT API Request --------------------------------------------------

// Start OB API Request -----------------------------------------------------

router.post("/obaddrequest", validInfo, authorize, async (req, res) => {
    console.log(req.body)
    
    let lastOBreq;
    //console.log(lastOTreq)
    try {
        const lastOB = await sql.query("SELECT transno FROM OBRequest where transno like 'OB"+new Date().getFullYear()+"%' order by transno desc");
        //console.log(lastOB.rowsAffected[0])
        if(lastOB.rowsAffected[0] > 0)
        {
            
            console.log(parseInt(lastOB.recordsets[0][0].transno.substring(6,11)) + 1)
            lastOBreq = "OB"+new Date().getFullYear() + zeroPad(parseInt(lastOB.recordsets[0][0].transno.substring(6,11)) + 1, 5).toString()
        }
        else
        {
            //console.log("wala")
            lastOBreq = "OB"+new Date().getFullYear() + zeroPad(1, 5).toString();
        }
    
        const data = await sql.request()
        .input('transno',mssql.VarChar,lastOBreq)
        .input('idno',mssql.VarChar,req.body.idno)
        .input('ccode',mssql.VarChar,req.body.com)
        .input('datefrom',mssql.Date,req.body.datefrom)
        .input('dateto',mssql.Date,req.body.dateto)
        .input('timefrom',mssql.VarChar,req.body.timefrom)
        .input('timeto',mssql.VarChar,req.body.timeto)
        .input('details',mssql.VarChar,req.body.details)
        .input('remarks',mssql.VarChar,req.body.remarks)
        .input('status',mssql.VarChar,"FILED")
        .input('approver',mssql.VarChar,"1ST LEVEL")
        .query("INSERT into OBRequest (transno,idno,ccode,datefrom,dateto,timefrom,timeto,details,remarks,status,approver,datefiled,lastupdate) values (@transno,@idno,@ccode,@datefrom,@dateto,@timefrom,@timeto,@details,@remarks,@status,@approver,GETDATE(),GETDATE()) ")
        APILog(req.route.stack[0].method,req.originalUrl)
        console.log(data.rowsAffected[0]);
        if(data.rowsAffected[0] > 0 )
        {
            return res.send({
                res: data.recordsets,
                status: 200,
                alert: "OB Request Sucessfully submitted!"
            })
        }
        else
        {
            return res.status(505).send({
                status: 505,
                alert: "Cannot process your request! Please refresh your browser and try again."
            })
        }
        
    } catch (error) {
        console.log(error.message)
        return res.status(505).send({
                status: 505,
                alert: "Cannot process your request! Please refresh your browser and try again."
            })
    }
});

router.get("/obgetallrequest", authorize, async (req, res) => {
    //console.log(req.user)
    try {
        const data = await sql.request()
        .input('idno',mssql.VarChar,req.user.id.idno)
        .input('ccode',mssql.VarChar,req.user.id.com)
        .query("SELECT * from OBRequest where idno = @idno and ccode= @ccode")
        APILog(req.route.stack[0].method,req.originalUrl)
        console.log(req.socket.remoteAddress)
        return res.send({
            res: data.recordsets[0]
        })
    } catch (error) {
        console.log(error.message)
        return res.status(505).send({
            status: 505,
            alert: "Error occured upon Data request."
        })
    }
})

// End OB API Request ---------------------------------------

module.exports = router;  