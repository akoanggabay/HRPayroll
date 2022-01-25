const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const http = require('http');
//const sql = require("mssql");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());  // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.use("/api/v1/logs", require("./routes/logs"));
app.use("/api/v1/auth", require("./routes/jwtAuth"));
app.use("/api/v1/request", require("./routes/request"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/api/v1/dropdown", require("./routes/dropdown"));
app.use("/api/v1/transaction", require("./routes/transactiontype"));
app.use("/api/v1/user", require("./routes/user"));


app.listen(port, function() {
  console.log(`App listening on port ${port}!`)
});