'use strict';

var express   = require('express'),
 router       = express.Router(),
 mysql        = require('mysql'),
 bcrypt       = require('bcrypt'),
 nodemailer   = require('nodemailer'),
 qr           = require('qr-image'),
 connection   =  mysql.createConnection({
   host    : 'localhost',
   user    : 'root',
   password: 'root',
   database: 'sowapp'
}),
 bcrypt = require('bcrypt-nodejs'),
 mysql_settings = {
  host    : 'localhost',
  user    : 'root',
  password: 'root',
  database: 'sowapp'
},
 qb = require('node-querybuilder').QueryBuilder(mysql_settings, 'mysql');

 router.post('/test', function(req, res){
   qb.select('unicode')
       .where({ "unicode": req.body.password})
       .get('student', function(err, result) {
         console.log(result);
         if(err){console.log("db exception");res.json("db error")}
          else{res.json(result)}
       });

 });
router.post('/register', function(req, res) {
   var hash = bcrypt.hashSync(req.body.dob+req.body.mobile);
   console.log(hash);
  var data = {
    name: req.body.name,
    dob: req.body.dob,
    email: req.body.email,
    mobile: req.body.mobile,
    unicode: hash
  };
  console.log(data.email)
qb.insert('student', data, function(err, result){
             if(err){res.json({"db exception": err.message});}
                   else{console.log("result",result);
                          res.json(result);}
                           });
              var svg_string = qr.imageSync(hash, { type: 'png' });
              console.log(svg_string);
                          let transporter = nodemailer.createTransport({
                              host: 'smtp.gmail.com',
                              port: 465,
                              secure: true, // secure:true for port 465, secure:false for port 587
                              auth: {
                                  user: 'nareshpraba9@gmail.com',
                                  pass: '9551447625'
                              }
                          });
                          let mailOptions = {
                 to: data.email,
                 subject: 'Hello ✔',
                 text: 'Hello world ?',
                 attachments: [{
                        filename: 'test.png',
                         content: svg_string}]
             };
             transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
          }
              console.log('Message %s sent: %s', info.messageId, info.response);
        });
});
router.post('/login', function(req, res) {
  console.log("login api");
  qb.select('unicode')
     .where({"unicode":req.body.password})
      .get('student', function(err, result) {
    console.log(err);
    if(err || result.length === 0){ res.json("invalid credentials");}
      else{ res.json("success");}
  });
});



module.exports = router;
