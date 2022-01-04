module.exports = function(req, res, next) {
  const { idno, com, password, reqtype, start, end, details, remarks,date,datefrom,dateto,timefrom,timeto } = req.body;

  if (req.path === "/register") {
    console.log(!email.length);
    if (![email, name, password].every(Boolean)) {
      return res.json("Missing Credentials");
    } 
  } else if (req.path === "/login") {
    if (![idno,com, password].every(Boolean)) {
      return res.json("Missing Credentials");
    }
  }

  else if (req.path === "/otaddrequest") {
    if (![start,end,details,date].every(Boolean)) {
      return res.status(505).json("Missing Credentials");
    }
  }

  else if (req.path === "/obaddrequest") {
    //console.log(req.body)
    if (![idno,com].every(Boolean)) {
      return res.status(505).json("Login Session expired! Please relogin.");
    }

    if (![datefrom,dateto,timefrom,timeto,details].every(Boolean)) {
      return res.status(505).json("Missing Credentials");
    }
  }

  next();
};
