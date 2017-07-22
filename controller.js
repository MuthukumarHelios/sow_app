'use strict';
var express   =  require('express'),
 router       =  express.Router(),
 mysql        =  require('mysql'),
 multer       =  require('multer'),
 fileman      =  require('fi-fileman'),
 upload       =  multer({dest: 'images/'}),
 nodemailer   =  require('nodemailer'),
 qr           =  require('qr-image'),
 validator    =  require('validator'),
   connection =  mysql.createConnection({
   host       : 'localhost',
   user       : 'root',
   password   : 'root',
   database   : 'sowapp'
}),
 bcrypt         = require('bcrypt-nodejs'),
 mysql_settings = {
  host    : 'localhost',
  user    : 'root',
  password: 'root',
  database: 'sowapp'
},
qb = require('node-querybuilder').QueryBuilder(mysql_settings, 'mysql');


router.use(fileman.multiparser());
router.post("/api", function(req, res){
    qb.select("*").get('student', function(err, result){
      if(err){return res.json("db exception");}
      return res.json(result);
    });
});

 router.post("/upload", upload.any(), function(req, res){
     console.log("upload.any()");
     console.log(req.body.name);
        res.send(req.files);
 });
router.post("/query", function(req, res){
   qb.select("dob, email").where({id:1}).get('student', function(err, result){
     if(err){return res.json(err.message);}
     return res.json(result);
   });
});
  router.post("admin/studet/confirm",  function(req, res){
  //  qb.select("dob, email").where({id: req.body.id}).get('student', function(err, result)
   var hash = bcrypt.hashSync(req.body.dob+req.body.mobile);
     var svg_string = qr.imageSync(hash,{type:'png' });
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
     subject: 'Hello',
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
     return res.json("mail sent");
  });
});
 router.post("/admin/register",  function(req, res){
    var hash = bcrypt.hashSync(req.body.password);
      console.log(bcrypt.compareSync("123",hash));
       var data = {
                 name      :  req.body.name,
                 email     :  req.body.email,
                 password  :  hash
              };
  qb.insert('admin', data , function(err, result){
        if(err) res.json("enter valid credentials");
                res.json(result);
     });
});


router.post("/admin/login", function(req, res){
   qb.select('password')
      .where({"email": req.body.email})
        .get('admin', function(err, result) {
          if(err || result.length === 0){res.json("invalid credentials");}
              else{res.json("success");}
    });
});
module.exports = router;
