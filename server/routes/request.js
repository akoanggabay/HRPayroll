const router = require("express").Router();
const sql = require("../msdb");
const mariadb = require("../mariadb");
const mssql = require('mssql');
const validInfo = require("../middleware/validInfo");
const authorize = require("../middleware/authorize");
const zeroPad = (num, places) => String(num).padStart(places, '0');
const moment = require("moment");

function APILog(method,url)
{
    return console.log('HTTP '+method + ' Request from: ' + url)
}

// Start OT API Request ----------------------------------------

router.post("/otaddrequest", validInfo, authorize, async (req, res) => {
    
    let lastOTreq;
    try {
        const lastOT = await sql.query("SELECT transno FROM OTRequest where transno like 'OT"+new Date().getFullYear()+"%' order by transno desc");

        if(lastOT.rowsAffected[0] > 0)
        {
            lastOTreq = "OT"+new Date().getFullYear() + zeroPad(parseInt(lastOT.recordsets[0][0].transno.substring(6,11)) + 1, 5).toString()
        }
        else
        {
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
    try {
        const data = await sql.request()
        .input('idno',mssql.VarChar,req.user.id.idno)
        .input('ccode',mssql.VarChar,req.user.id.com)
        .query("SELECT * from OTRequest where idno = @idno and ccode= @ccode")
        APILog(req.route.stack[0].method,req.originalUrl)
        
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
    
    let lastOBreq;
    
    try {
        const lastOB = await sql.query("SELECT transno FROM OBRequest where transno like 'OB"+new Date().getFullYear()+"%' order by transno desc")
        const userid = await sql.query("SELECT USERID FROM USERINFO where BADGENUMBER = '"+req.body.idno+"'")
        //console.log(userid.recordsets[0][0].USERID)
        console.log(moment(req.body.datefrom).add(1,'d').format("YYYY-MM-DD") + " " + req.body.timefrom)
        console.log(moment(req.body.datefrom).add(1,'d').format("YYYY-MM-DD") + " " + req.body.timeto)
        if(lastOB.rowsAffected[0] > 0)
        {
            
            lastOBreq = "OB"+new Date().getFullYear() + zeroPad(parseInt(lastOB.recordsets[0][0].transno.substring(6,11)) + 1, 5).toString()
        }
        else
        {
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
        
        if(data.rowsAffected[0] > 0 )
        {
            for (let i = 0; i <= req.body.nod; i++) {

                console.log(moment(req.body.datefrom).add(i,'d').format("YYYY-MM-DD") + " " + req.body.timefrom)
                const timein = await sql.request()
                .input('USERID',mssql.VarChar,userid.recordsets[0][0].USERID)
                .input('CHECKTIME',mssql.VarChar,moment(req.body.datefrom).add(i,'d').format("YYYY-MM-DD") + " " + req.body.timefrom)
                .input('CHECKTYPE',mssql.VarChar,"I")
                .input('VERIFYCODE',mssql.Int,1518)
                .input('SENSORID',mssql.Int,1518)
                .input('sn',mssql.VarChar,lastOBreq)
                .query("INSERT into CHECKINOUT (USERID, CHECKTIME, CHECKTYPE, VERIFYCODE, SENSORID, sn, UserExtFmt) values (@USERID, @CHECKTIME, @CHECKTYPE, @VERIFYCODE, @SENSORID, @sn, 1)")


                const timeout = await sql.request()
                .input('USERID',mssql.VarChar,userid.recordsets[0][0].USERID)
                .input('CHECKTIME',mssql.DateTime,moment(moment(req.body.datefrom).add(i,'d').format("YYYY-MM-DD") + " " + req.body.timeto ).add(8,'h').format("YYYY-MM-DD HH:mm"))
                .input('CHECKTYPE',mssql.VarChar,"O")
                .input('VERIFYCODE',mssql.Int,1518)
                .input('SENSORID',mssql.Int,1518)
                .input('sn',mssql.VarChar,lastOBreq)
                .query("INSERT into CHECKINOUT (USERID, CHECKTIME, CHECKTYPE, VERIFYCODE, SENSORID, sn, UserExtFmt) values (@USERID, @CHECKTIME, @CHECKTYPE, @VERIFYCODE, @SENSORID, @sn, 1)")
            
            }

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
    
    try {
        const data = await sql.request()
        .input('idno',mssql.VarChar,req.user.id.idno)
        .input('ccode',mssql.VarChar,req.user.id.com)
        .query("SELECT * from OBRequest where idno = @idno and ccode= @ccode")
        APILog(req.route.stack[0].method,req.originalUrl)
        
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

// Start of API Request ----------------------------------------------------------

router.post("/addrequest", validInfo, authorize, async (req, res) => {
    
    let lastreq;
    //console.log(req.body)
    try {

        
        const last = await sql.query("SELECT transno FROM Request where transno like 'TR"+new Date().getFullYear()+"%' order by transno desc")
        const userid = await sql.query("SELECT USERID FROM USERINFO where BADGENUMBER = '"+req.body.idno+"'")
        const type = await sql.query("SELECT * FROM transactiontype where code = '"+req.body.type+"'")
        
        //console.log(userid.recordsets[0][0].USERID)
        //console.log(moment(req.body.datefrom).add(1,'d').format("YYYY-MM-DD") + " " + req.body.timefrom)
        //console.log(moment(req.body.datefrom).add(1,'d').format("YYYY-MM-DD") + " " + req.body.timeto)

        /* const exist = await sql.query("SELECT userid,checktime FROM checkinout where userid =  '"+userid.recordsets[0][0].USERID+"' and checktime = '"+moment(moment(req.body.datefrom).add(42,'d').format("YYYY-MM-DD") + " " + req.body.timeto ).format("YYYY-MM-DD HH:mm:ss")+"'")
        console.log(moment(moment(req.body.datefrom).add(0,'d').format("YYYY-MM-DD") + " " + req.body.timeto ).format("YYYY-MM-DD HH:mm:ss"))
        console.log(exist.recordsets[0].length) */
        if(last.rowsAffected[0] > 0)
        {
            
            lastreq = "TR"+new Date().getFullYear() + zeroPad(parseInt(last.recordsets[0][0].transno.substring(6,11)) + 1, 5).toString()
        }
        else
        {
            lastreq = "TR"+new Date().getFullYear() + zeroPad(1, 5).toString();
        }
        
        const data = await sql.request()
        .input('transno',mssql.VarChar,lastreq)
        .input('idno',mssql.VarChar,req.body.idno)
        .input('ccode',mssql.VarChar,req.body.com)
        .input('type',mssql.VarChar,req.body.type)
        .input('datefrom',mssql.Date,req.body.datefrom)
        .input('dateto',mssql.Date,req.body.dateto)
        .input('timefrom',mssql.VarChar,req.body.timefrom)
        .input('timeto',mssql.VarChar,req.body.timeto)
        .input('details',mssql.VarChar,req.body.details)
        .input('remarks',mssql.VarChar,req.body.remarks)
        .input('status',mssql.VarChar,"FILED")
        .input('approver',mssql.VarChar,"1ST LEVEL")
        .query("INSERT into Request (transno,idno,ccode,type,datefrom,dateto,timefrom,timeto,details,remarks,status,approver,datefiled,lastupdate,active) values (@transno,@idno,@ccode,@type,@datefrom,@dateto,@timefrom,@timeto,@details,@remarks,@status,@approver,GETDATE(),GETDATE(),1) ")
        APILog(req.route.stack[0].method,req.originalUrl)
        
        if(data.rowsAffected[0] > 0 && type.recordsets[0][0].logs === 1)
        {
            for (let i = 0; i <= req.body.nod; i++) {

                const timein = await sql.request()
                .input('USERID',mssql.VarChar,userid.recordsets[0][0].USERID)
                .input('CHECKTIME',mssql.VarChar,moment(req.body.datefrom).add(i,'d').format("YYYY-MM-DD") + " " + req.body.timefrom)
                .input('CHECKTYPE',mssql.VarChar,"I")
                .input('VERIFYCODE',mssql.Int,req.body.type)
                .input('SENSORID',mssql.Int,req.body.type)
                .input('sn',mssql.VarChar,lastreq)
                .query("INSERT into CHECKINOUT (USERID, CHECKTIME, CHECKTYPE, VERIFYCODE, SENSORID, sn, UserExtFmt) values (@USERID, @CHECKTIME, @CHECKTYPE, @VERIFYCODE, @SENSORID, @sn, 0)")


                const timeout = await sql.request()
                .input('USERID',mssql.VarChar,userid.recordsets[0][0].USERID)
                .input('CHECKTIME',mssql.DateTime,moment(moment(req.body.datefrom).add(i,'d').format("YYYY-MM-DD") + " " + req.body.timeto ).add(8,'h').format("YYYY-MM-DD HH:mm"))
                .input('CHECKTYPE',mssql.VarChar,"O")
                .input('VERIFYCODE',mssql.Int,req.body.type)
                .input('SENSORID',mssql.Int,req.body.type)
                .input('sn',mssql.VarChar,lastreq)
                .query("INSERT into CHECKINOUT (USERID, CHECKTIME, CHECKTYPE, VERIFYCODE, SENSORID, sn, UserExtFmt) values (@USERID, @CHECKTIME, @CHECKTYPE, @VERIFYCODE, @SENSORID, @sn, 0)")
                /* const exist = await sql.query("SELECT * FROM checkinout where userid =  '"+userid.recordsets[0][0].USERID+"' and WORKCODE = 0 and UserExtFmt = 0 and (DATEPART(yy, CHECKTIME) = "+moment(req.body.datefrom).add(i,'d').format("YYYY")+" AND DATEPART(mm, CHECKTIME) = "+moment(req.body.datefrom).add(i,'d').format("MM")+" AND DATEPART(dd, CHECKTIME) = "+moment(req.body.datefrom).add(i,'d').format("DD")+")")
                //console.log(exist.recordsets[0])
                //console.log(exist.recordsets[0].length)
                if(exist.recordsets[0].length > 0)
                {
                    const Updatetimein = await sql.request()
                    .input('USERID',mssql.VarChar,userid.recordsets[0][0].USERID)
                    .input('CHECKTIME',mssql.VarChar,moment(req.body.datefrom).add(i,'d').format("YYYY-MM-DD") + " " + req.body.timefrom)
                    .input('VERIFYCODE',mssql.Int,req.body.type)
                    .input('SENSORID',mssql.Int,req.body.type)
                    .input('sn',mssql.VarChar,lastreq)
                    .query("UPDATE CHECKINOUT set CHECKTIME = @CHECKTIME, VERIFYCODE = @VERIFYCODE, sn = @sn, SENSORID = @SENSORID where userid =  '"+userid.recordsets[0][0].USERID+"' and CHECKTYPE = 'I' and WORKCODE = 0 and UserExtFmt = 0 and (DATEPART(yy, CHECKTIME) = "+moment(req.body.datefrom).add(i,'d').format("YYYY")+" AND DATEPART(mm, CHECKTIME) = "+moment(req.body.datefrom).add(i,'d').format("MM")+" AND DATEPART(dd, CHECKTIME) = "+moment(req.body.datefrom).add(i,'d').format("DD")+")")


                    const Updatetimeout = await sql.request()
                    .input('USERID',mssql.VarChar,userid.recordsets[0][0].USERID)
                    .input('CHECKTIME',mssql.DateTime,moment(moment(req.body.datefrom).add(i,'d').format("YYYY-MM-DD") + " " + req.body.timeto ).add(8,'h').format("YYYY-MM-DD HH:mm"))
                    .input('CHECKTYPE',mssql.VarChar,"O")
                    .input('VERIFYCODE',mssql.Int,req.body.type)
                    .input('SENSORID',mssql.Int,req.body.type)
                    .input('sn',mssql.VarChar,lastreq)
                    .query("UPDATE CHECKINOUT set CHECKTIME = @CHECKTIME, VERIFYCODE = @VERIFYCODE, sn = @sn, SENSORID = @SENSORID where userid =  '"+userid.recordsets[0][0].USERID+"' and CHECKTYPE = 'O' and WORKCODE = 0 and UserExtFmt = 0 and (DATEPART(yy, CHECKTIME) = "+moment(req.body.datefrom).add(i,'d').format("YYYY")+" AND DATEPART(mm, CHECKTIME) = "+moment(req.body.datefrom).add(i,'d').format("MM")+" AND DATEPART(dd, CHECKTIME) = "+moment(req.body.datefrom).add(i,'d').format("DD")+")")
                }
                else
                {
                    const timein = await sql.request()
                    .input('USERID',mssql.VarChar,userid.recordsets[0][0].USERID)
                    .input('CHECKTIME',mssql.VarChar,moment(req.body.datefrom).add(i,'d').format("YYYY-MM-DD") + " " + req.body.timefrom)
                    .input('CHECKTYPE',mssql.VarChar,"I")
                    .input('VERIFYCODE',mssql.Int,req.body.type)
                    .input('SENSORID',mssql.Int,req.body.type)
                    .input('sn',mssql.VarChar,lastreq)
                    .query("INSERT into CHECKINOUT (USERID, CHECKTIME, CHECKTYPE, VERIFYCODE, SENSORID, sn, UserExtFmt) values (@USERID, @CHECKTIME, @CHECKTYPE, @VERIFYCODE, @SENSORID, @sn, 0)")


                    const timeout = await sql.request()
                    .input('USERID',mssql.VarChar,userid.recordsets[0][0].USERID)
                    .input('CHECKTIME',mssql.DateTime,moment(moment(req.body.datefrom).add(i,'d').format("YYYY-MM-DD") + " " + req.body.timeto ).add(8,'h').format("YYYY-MM-DD HH:mm"))
                    .input('CHECKTYPE',mssql.VarChar,"O")
                    .input('VERIFYCODE',mssql.Int,req.body.type)
                    .input('SENSORID',mssql.Int,req.body.type)
                    .input('sn',mssql.VarChar,lastreq)
                    .query("INSERT into CHECKINOUT (USERID, CHECKTIME, CHECKTYPE, VERIFYCODE, SENSORID, sn, UserExtFmt) values (@USERID, @CHECKTIME, @CHECKTYPE, @VERIFYCODE, @SENSORID, @sn, 0)")
                } */

                
            }

            return res.send({
                res: data.recordsets,
                status: 200,
                alert: "Request Sucessfully submitted!"
            })
        }
        else if(data.rowsAffected[0] > 0 && type.recordsets[0][0].logs === 0)
        {
            return res.send({
                res: data.recordsets,
                status: 200,
                alert: "Request Sucessfully submitted!"
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
                alert: error.message
            })
    }
});

router.get("/getallrequest", authorize, async (req, res) => {
    
    try {
        const data = await sql.request()
        .input('idno',mssql.VarChar,req.user.id.idno)
        .input('ccode',mssql.VarChar,req.user.id.com)
        .query("SELECT * from Request where idno = @idno and ccode= @ccode and active = 1 order by datefiled desc")
        APILog(req.route.stack[0].method,req.originalUrl)
        
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

router.get("/getdetails/:transno", async (req, res) => {
    //console.log(req.params.userid)
    const data = await sql.query("SELECT * from Request where transno = '"+req.params.transno+"' and active =1")
    
    return res.send({
        res: data.recordsets
    })
})
router.put("/updaterequest", authorize, async (req, res) => { 

    try {
        const data = await sql.request()
        .input('transno',mssql.VarChar,req.body.transno)
        .input('details',mssql.VarChar,req.body.details)
        .input('remarks',mssql.VarChar,req.body.remarks)
        .query("UPDATE Request set details = @details, remarks = @remarks where transno = @transno and active = 1")
        APILog(req.route.stack[0].method,req.originalUrl)

        if(data.rowsAffected[0] > 0 )
        {
            return res.send({
                res: data.recordsets,
                status: 200,
                alert: "Sucessfully Updated!"
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
        
    }
})

router.put("/removedetails/:transno", authorize, async (req, res) => { 
    
    try {
        const data = await sql.request()
        .input('transno',mssql.VarChar,req.params.transno)
        .query("UPDATE Request set active = 0, status = 'REMOVED' where transno = @transno and active = 1")
        APILog(req.route.stack[0].method,req.originalUrl)

        if(data.rowsAffected[0] > 0 )
        {

            const results = await sql.request()
                .input('transno',mssql.VarChar,req.params.transno)
                .query("DELETE CHECKINOUT where sn = @transno")
            return res.send({
                res: data.recordsets,
                status: 200,
                alert: "Transaction ID successfully removed!"
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
        
    }
})

module.exports = router;  