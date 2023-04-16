/*
    Name : Surpreet Singh
    St.ID : 218663803
    unit : sit323
*/

//Took a reference from this website:  https://blog.jscrambler.com/implementing-jwt-using-passport


//importing libraries
var express = require("express");
var bodyParser = require("body-parser");
var jwt = require("jwt-simple");
var auth = require("./authorization.js")();
var users = require("./data.js");
var cfg = require("./configuration.js");
var app = express();
const winston = require("winston")  // importing winston library for logger

app.use(bodyParser.json());
app.use(auth.initialize());

const logger = winston.createLogger({   // logger object
    level : 'info',
    format: winston.format.json(),
    defaultMeta: {service : 'calculator-service'},
    transports: [
        new winston.transports.Console({
        format: winston.format.simple(),
        }),
        new winston.transports.File({filename: 'logs/error.log', level : 'error'}), // transporting error to erro.log
        new winston.transports.File({filename: 'logs/combined.log'}),    // all the requests will be logged into combined.log
    ]
})

//funtion for addition
const add = (n1,n2) => {
  return n1+n2;
}

//function fro subtraction
const subtract = (n1,n2) => {
  return n1-n2;
}

//function for multiplication
const multiply = (n1,n2) => {
  return n1*n2;
}

//function for division
const divide = (n1,n2) => {
  return n1/n2;
}


// This is a route handler for POST requests to the "/token" endpoint.
app.post("/token", function(req, res) {
  // Check if the request contains an email and password in the request body.
  if (req.body.email && req.body.password) {
      // Extract the email and password from the request body.
      var email = req.body.email;
      var password = req.body.password;
      // Search for a user with matching email and password in the users array.
      var user = users.find(function(u) {
          return u.email === email && u.password === password;
      });
      // If a user is found, create a payload containing their ID and encode it into a JSON Web Token (JWT).
      if (user) {
          var payload = {
              id: user.id
          };
          var token = jwt.encode(payload, cfg.jwtSecret);
          // Return the JWT in a JSON response.
          res.json({
              token: token
          });
      } else {
          // If no user is found, return a 401 Unauthorized status code.
          res.sendStatus(401);
      }
  } else {
    // If the request does not contain an email and password, return a 401 Unauthorized status code.
      res.sendStatus(401);
  }
});

//API endpoint for addition microservice 
app.get('/add', auth.authenticate(),(req, res) => {

    try {
          const n1 = parseFloat(req.query.n1); //assigning the variable n1 with 1st number from the request query
          const n2 = parseFloat(req.query.n2); //assigning the variable n2 with 2nd number from the request query
          if(isNaN(n1)){         // checking if n1 is a number or float value
              logger.error("n1 is incorrectly defined");   // logging error into log files
              throw new error("n1 is incorrectly defined");   // throwing error for the catch()
          } 
          if(isNaN(n2)){          // checking if n2 is a number or float value
              logger.error("n2 is incorrectly defined");    // logging error into log files
              throw new error("n2 is not correctly defined");  // throwing error for the catch()
          }


          logger.info("parameters " + n1 + " and " + n2+ " received for addition");   // logging info into log file
          const result = add(n1,n2);              // calling add() to perfrom addition
          res.status(200).json({statuscode : 200,data:result});    // responding the server with the result

    } catch (error) {
          console.error(error);    //logging error to the console
          res.status(500).json({statuscode : 500,msg: error.toString()});  // responding server with the error
      
    }
    
  });
  
  //API endpoint for subtraction microservice 
  app.get('/subtract', auth.authenticate(), (req, res) => {

    try {
      const n1 = parseFloat(req.query.n1); //assigning the variable n1 with 1st number from the request query
      const n2 = parseFloat(req.query.n2); //assigning the variable n2 with 2nd number from the request query
      if(isNaN(n1)){         // checking if n1 is a number or float value
          logger.error("n1 is incorrectly defined");   // logging error into log files
          throw new error("n1 is incorrectly defined");   // throwing error for the catch()
      } 
      if(isNaN(n2)){          // checking if n2 is a number or float value
          logger.error("n2 is incorrectly defined");    // logging error into log files
          throw new error("n2 is not correctly defined");  // throwing error for the catch()
      }


      logger.info("Parameters " + n1 + " and " + n2+ " received for subtraction"); // logging info into log file
      const result = subtract(n1,n2);             // calling subtract() to perfrom subtraction
      res.status(200).json({statuscode : 200,data:result});    // responding the server with the result

    } catch (error) {
          console.error(error);       //logging error to the console
          res.status(500).json({statuscode : 500,msg: error.toString()});   // responding server with the error
      
    }
  });


  //API endpoint for multiplication microservice 
  app.get('/multiply', auth.authenticate(), (req, res) => {
    try {
      const n1 = parseFloat(req.query.n1); //assigning the variable n1 with 1st number from the request query
      const n2 = parseFloat(req.query.n2); //assigning the variable n2 with 2nd number from the request query
      if(isNaN(n1)){         // checking if n1 is a number or float value
          logger.error("n1 is incorrectly defined");   // logging error into log files
          throw new error("n1 is incorrectly defined");   // throwing error for the catch()
      } 
      if(isNaN(n2)){          // checking if n2 is a number or float value
          logger.error("n2 is incorrectly defined");    // logging error into log files
          throw new error("n2 is not correctly defined");  // throwing error for the catch()
      }


      logger.info("Parameters " + n1 + " and " + n2+ " received for multiplication");   // logging info into log file
      const result = multiply(n1,n2);             // calling multiply() to perfrom multiplicaion
      res.status(200).json({statuscode : 200,data:result});       // responding the server with the result

    } catch (error) {
          console.error(error);      //logging error to the console
          res.status(500).json({statuscode : 500,msg: error.toString()});     // responding server with the error
      
    }
  });
  
  //API endpoint for division microservice 
  app.get('/divide', auth.authenticate(), (req, res) => {
    try {
      const n1 = parseFloat(req.query.n1); //assigning the variable n1 with 1st number from the request query
      const n2 = parseFloat(req.query.n2); //assigning the variable n2 with 2nd number from the request query
      if(isNaN(n1)){         // checking if n1 is a number or float value
          logger.error("n1 is incorrectly defined");   // logging error into log files
          throw new error("n1 is incorrectly defined");   // throwing error for the catch()
      } 
      if(isNaN(n2)){          // checking if n2 is a number or float value
          logger.error("n2 is incorrectly defined");    // logging error into log files
          throw new error("n2 is not correctly defined");  // throwing error for the catch()
      }else if (n2 === 0) {      // checking if the denominator is Zero
        logger.error('Denominator cannot be zero');  // logging error into log files
        throw new error('Denominator cannot be zero');  // throwing error for the catch()
      }


      logger.info("Parameters " + n1 + " and " + n2+ " received for division");   // logging info into log file
      const result = divide(n1,n2);              // calling divide() to perfrom division
      res.status(200).json({statuscode : 200,data:result});   // responding the server with the result

    } catch (error) {
          console.error(error);       //logging error to the console
          res.status(500).json({statuscode : 500,msg: error.toString()});       // responding server with the error
      
    }
  });


app.listen(3000, function() {
    console.log("My API is running...");
});

module.exports = app;