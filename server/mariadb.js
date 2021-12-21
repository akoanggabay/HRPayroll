const sql = require("mysql");



const pool = sql.createConnection({
    user: 'iss',
    password: "d3f@ult101",
    host: "10.168.1.5",
    database: "iss"
});

/* let pool = con.connect(function (err) {
    
    if (err) console.log(err.message);

    // create Request object
    else console.log('Connected to Maria Database!');
    
}); */

module.exports = pool;