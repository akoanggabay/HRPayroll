const sql = require("mssql");


const config = {
    user: 'duane',
    password: "duanepogi",
    server: "10.168.2.8\\SQLexpress",
    database: "Biometrics",
    port: 14330,
    options: {
        encrypt: false,
    }
};

let pool = sql.connect(config, function (err) {
    
    if (err) console.log(err.message);

    // create Request object
    else console.log('Connected to Microsoft SQL Database!');
    
});

module.exports = pool;
