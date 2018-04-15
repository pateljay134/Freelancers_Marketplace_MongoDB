var mysql = require('mysql');
var bodyParser = require('body-parser');
var Parser = require('expr-eval').Parser;
var express = require('express');
var app = express();
var multiparty = require('multiparty');
var fs = require('fs');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const nodemailer = require('nodemailer');
var http = require('http');
var util = require('util');
var session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
var kafka = require('./kafka/client');

var LocalStrategy = require('passport-local').Strategy;
var mongodbStore = require('connect-mongo')(session);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var users = require('./src/freelancer/models/users');
var projects = require('./src/freelancer/models/projects');
var project_bids = require('./src/freelancer/models/project_bids');
var transactions = require('./src/freelancer/models/transaction');

// var url = "mongodb://root:2131@ds231749.mlab.com:31749/freelancer"


mongoose.connect("mongodb://root:2131@ds231749.mlab.com:31749/freelancer");
var url = "mongodb://root:2131@ds231749.mlab.com:31749/freelancer"

app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000");
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
 res.setHeader('Cache-Control', 'no-cache');
 next();
});

app.use(passport.initialize());
app.use(passport.session());


app.use(session({
  name: 'session', 
  store: new mongodbStore({mongooseConnection: mongoose.connection, touchAfter: 24 * 3600}), 
  secret: 'qwertyuiop123456789', 
  resave: false,
  saveUninitialized: false, 
  cookie: {maxAge: 1000 * 60 * 45}
}));


passport.serializeUser(function(user, done) {
  console.log("I am in serialiser")
  console.log(user);
  console.log(user.id);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // console.log("Deserialize")
  users.findOne(user.email, function(err, user) {
    if(err) {
      console.error('There was an error accessing the records of' +
      ' user with id: ' + id);
      return console.log(err.message);
    }
    console.log("I am in deserialiser")
    console.log(user);
    return done(null, user);
  })
});

passport.use('local-signup', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
},
function(req, email, password, done) {
    users.findOne({email: email}, function(err, user) {
        if(err) {
          return errHandler(err);
          }
        if(user) {
          console.log('user already exists');
          return done(null, false, {errMsg: 'email already exists'});
        }
        else {
          var bcrypt = require('bcrypt');
          const saltRounds = 10;
          bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {
              var newUser = new users();
              var myobj = { id : newUser.id, name: req.body.name, email : req.body.email, password: password, profile_image:null, balance:0, assigned_project_id : [] };
              newUser.name = req.body.name;
              newUser.email = email;
              newUser.password = password;
              newUser.save(function(err) {
                if(err) {
                  console.log(err);
                  if(err.message == 'User validation failed') {
                    console.log(err.message);
                    return done(null, false, {errMsg: 'Please fill all fields'});
                  }
                  return errHandler(err);
                }
                else{
                  console.log("Inserting in database")
                    mongoose.connect(url, function(err, db) {
                    db.collection("tranaction").insertOne({ email : req.body.email } ,function(err, result) {if(err) console.log(err)
                      console.log("data inserted")})
                  });
                  console.log("Error ni dukan")
                  return done(null, newUser);
                }   
              });
          })
        })
      }
    })
}));

app.post('/signupprocess', function(req, res) {
  console.log("Hello")
  passport.authenticate('local-signup', function(err, user, info) {
    if (err) throw (err);
    if (!user) {
      res.json({logged_in:false});
    }
    else{
      req.login(user, function(err){
        if(err){
          console.error(err);
        }
      });
      res.json({rows: user, logged_in : true, session_exist : true});
    }
  })(req, res);
  // var bcrypt = require('bcrypt');
  // const saltRounds = 10;
  // mongoose.connect(url, function(err, db) {
  //   if (err) res.json({logged_in:false});
  //   else{
  //     bcrypt.genSalt(saltRounds, function(err, salt) {
  //       bcrypt.hash(req.body.password, salt, function(err, hash) {
  //         var myobj = { name: req.body.name, email : req.body.email, password: hash, profile_image:null, balance:0, assigned_project_id : [] };
  //         db.collection("users").insertOne(myobj, function(err, result) {
  //           if (err) {
  //             res.json({logged_in:false});
  //           }
  //           else{
  //             db.collection("tranaction").insertOne(
  //               { email : req.body.email }
  //             )
  //           // db.close();
  //           res.json({logged_in:true, result:req.body.name});
  //           }
  //         });
  //       });
  //     });
  //   }
  // });
});



app.get('/checksession', function(req, res){
  // console.log(req.session)
  // var session_value = req.session !== "undefined" ? req.session.passport.user : req.session;
  if(typeof req.session.passport !== "undefined")
  res.json({session_exist: true, session: req.session});
  else{
    res.json({session_exist: false});
  }
})


app.post('/checkemail', function(req, res) {
  mongoose.connect(url, function(err, db) {
    if (err) throw err;
    var query = users.find({email: req.body.email})

    query.exec(function(err, rows){
      if (err) throw err;
      if(rows.length>=1){
        res.json({user_exist : true})
      }
      else{
        res.json({user_exist:false})
      }
      // db.close();
    })

  });
});


passport.use('local-login', new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true
},
function(req, email, password, done) {
  var data = req.body;
    mongoose.connect(url, function(err, db) {
      db.collection("users").findOne({email: email}, function(err, user) {
          if(err) {
            console.log("Error ni dukan")
            return errHandler(err);
            }
          if(user) {
            console.log("User Exist")
            console.log(user)
            // if(user.password === req.body.password){
              return done(null, user);
            }else{
              return done(null, false); 
            }
          // }
        
        })
    })
  }));


app.post('/signinprocess', function(req, res) {
  // var bcrypt = require('bcrypt');
  // const saltRounds = 10;
  // mongoose.connect(url, function(err, db) {
  //   if (err) res.json({user_exist : false});
  //   else{
  //     bcrypt.genSalt(saltRounds, function(err, salt) {
  //       bcrypt.hash(req.body.password, salt, function(err, hash) {
  //         var myobj = { email : req.body.email, password: hash };
  //         db.collection("users").findOne(myobj, function(err, result) {
  //           if (err) {
  //             res.json({logged_in:false});
  //           }
  //           else{
  //           // db.close();
  //           db.collection("users").find({email : req.body.email}).toArray( function(err, result) {
  //             res.json({logged_in:true, result:result[0].name});
  //           });
  //           }
  //         });
  //       });
  //     });
  //   }
  // });



  console.log("Hello")
  passport.authenticate('local-login', function(err, user, info) {
    if (err) throw (err);
    if (!user) {
      res.json({logged_in: false});
    }
    else{
      req.login(user, function(err){
        if(err){
          console.error(err);
          // return next(err);
        }
      });
      res.json({logged_in: true, rows: user, session_exist : true});
    }
  })(req, res);

});

app.get('/signout', function(req, res){
  req.logout();
  console.log("Hello")
  req.session.destroy();
  res.json({message: "Session Destroyed",session_exist : false, logged_in : false, session: req.session});
});


app.post('/addproject', function(req, res) {

  var project  = new projects;
  let form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
  let { path: tempPath, originalFilename } = files.file[0];
  var fileType = originalFilename.split(".");
  var fileName = Date.now() + '.' + fileType[fileType.length - 1]

  var myobj = { project_id : project.id, days:0, title: fields.name[0] , description : fields.description[0], skills_required: fields.skills[0], employer:fields.email[0], budget_range:fields.range[0], file:fileName, status : "PENDING" };
  
  kafka.make_request('addproject', myobj, function(err, rows){
    if (err) throw err;
    else{ 
        if(rows.project_added){
        let copyToPath = "./src/files/" + fileName;
        fs.readFile(tempPath, (err, data) => {
            if (err) throw err;
            fs.writeFile(copyToPath, data, (err) => {
              if (err) throw err;
                fs.unlink(tempPath, () => {
                });
                res.json({project_added : true});
            });
        });
      }
    }
  });
  
  
  
    //   mongoose.connect(url, function(err, db) {
    //   if (err) throw err;
    //   else{
    //     var myobj = { project_id : project.id, days:0, title: fields.name[0] , description : fields.description[0], skills_required: fields.skills[0], employer:fields.email[0], budget_range:fields.range[0], file:fileName, status : "PENDING" };

    //     db.collection("projects").insertOne(myobj, function(err, result) {
    //       if(err){
    //         res.json({project_added:false});
    //       }
    //       else{
    //         let copyToPath = "./src/files/" + fileName;
    //         fs.readFile(tempPath, (err, data) => {
    //           if (err) throw err;
    //           fs.writeFile(copyToPath, data, (err) => {
    //             if (err) throw err;
    //             fs.unlink(tempPath, () => {
    //             });
    //             res.json({project_added : true});
    //           });
    //         });
    //       }
    //     });
    //   }
    //   });
    // })
})
});
///////////////////////////////////////////////

app.post('/profilefetch', function(req, res) {
  kafka.make_request('profilefetch', req.body, function(err, rows){
    if (err){ throw err; res.json({logged_in:false})}
    else{
      res.json({rows : rows})
    }
  });
});
////////////////////////////////////////////////

// app.post('/bidderfetch', function(req, res) {
//   connection.query("SELECT * from users where username = ?",req.body.username,function(err, rows) {
//     if(rows.length>=1){
//       res.json({rows : rows[0]})
//     }
//     else{
//       res.json({logged_in:false})
//     }
//   });

// });

app.post('/profileupdate', function(req, res) {
  kafka.make_request('profileupdate', req.body, function(err, rows){
    if (err){ throw err; res.json({data_inserted:false}) }
    else{
      res.json({data_inserted:true});
    }
  });
});
/////////////////////////////////////////////////

app.post('/imageupdate', function(req, res) {

  let form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {

    let { path: tempPath, originalFilename } = files.file[0];
    var fileType = originalFilename.split(".");
    var email = fields.email[0];
    var fileName = Date.now() + '.' + fileType[fileType.length - 1]
    mongoose.connect(url, function(err, db) {
      if (err) throw err;
      else{
        db.collection("users").update({email : email}, { $set: {profile_image : fileName }}, function(err, rows){
          if(err){
            res.json({image_updated:false});
          }
          else{

            let copyToPath = "./src/images/" + fileName;
            
            fs.readFile(tempPath, (err, data) => {
              if (err) throw err;
              fs.writeFile(copyToPath, data, (err) => {
                if (err) throw err;
                fs.unlink(tempPath, () => {
                });
                res.json({image_updated : true});
              });
            });

          }
        })
      }
    });

  })
});



app.post('/userprojects', function(req, res) {
  kafka.make_request('userprojects', req.body, function(err, rows){
    if (err){ throw err; res.json({logged_in:false})}
    else{
      res.json({rows : rows})
    }
  });
});
/////////////////////////////////////////////////

app.post('/projectbidcount', function(req, res) {
  kafka.make_request('projectbidcount', req.body, function(err, rows){
    if(!err ){
        res.json({project_id : rows.project_id, total_bids:rows.total_bids})
    }else{
        res.json({result:null})
    }
  });
});
///////////////////////////////////////////////////

app.post('/hirebidder', function(req, res) {
  kafka.make_request('hirebidder', req.body, function(err, rows){
    if (err) throw err;
    else{ res.json({bidder_hired:true}) }
  });
});
//////////////////////////////////////////////////

app.post('/biddersfetch', function(req, res) {
  kafka.make_request('biddersfetch', req.body, function(err, rows){
    if (err) throw err;
    else{ res.json({rows : rows.rows, status: 200}) }
  });
});
//////////////////////////////////////////////////

app.post('/userbids', function(req, res) {
  kafka.make_request('userbids', req.body, function(err, rows){
    if (err){ throw err; res.json({logged_in:false})}
    else{
      res.json({rows : rows})
    }
  });
});
////////////////////////////////////////////////

app.post('/projectsfetch', function(req, res) {
  kafka.make_request('projectsfetch', req.body, function(err, rows){
    if (err) throw err;
    console.log(rows)
    console.log("I am in session")
    res.json({rows:rows})
    // rows.length >= 1 ? res.json({data_present: true, rows: rows}) :  res.json({data_present: false});
  }); 

  // mongoose.connect(url, function(err, db) {
  //   if (err) res.json({logged_in:false})
  //   else{
  //     console.log(req.body.sort)
  //     db.collection("projects").find().sort({ budget_range: req.body.sort }).toArray(function(err, rows){
  //       if(!err){
  //                     // db.collection("projects").find().toArray(function(err, rows){
  //                     //   if(!err){
  //                         // db.collection("project_bids").aggregate(
  //                         //     {
  //                         //       $group:
  //                         //         {
  //                         //           _id: "$project_id",
  //                         //           avg: { $avg: "$days" }
  //                         //         }
  //                         //     }).toArray(function(err, result){
  //                         //     if(!err && typeof result[0] !== "undefined"){
  //                         //       console.log(result)
  //                         //         res.json({rows:rows[0], result:result[0].avg.toFixed(2)})
  //                         //     }else{
  //                         //         res.json({rows:rows[0], result:null})
  //                         //     }
  //                         // });
  //                       // }
  //                       // else{
  //                       //   res.json({logged_in:false})
  //                       // }
  //                 // });

  //         res.json({rows : rows})
  //       }
  //       else{
  //         res.json({logged_in:false})
  //       }
  //     })
      
  //   }
  // });
    
});
//////////////////////////////////////////////

app.post('/projectfetch', function(req, res) {
  kafka.make_request('projectfetch', req.body, function(err, rows){
    if (err) throw err;
    rows.result !== null ? res.json( { rows:rows.rows[0], result: rows.result[0].avg.toFixed(2) } ) : res.json({rows:rows.rows[0]})
  });
})
// ////////////////////////////////////////////

app.post('/searchprojects', function(req, res) {
  kafka.make_request('searchprojects', req.body, function(err, rows){
    if (err) throw err;
    res.json({rows : rows.rows})
  });
});
////////////////////////////////////////////////////

app.post('/searchuserprojects', function(req, res) {
  kafka.make_request('searchuserprojects', req.body, function(err, rows){
    if (err) throw err;
    res.json({rows : rows.rows})
  });
});
//////////////////////////////////////////////////////

app.post('/searchbiddedproject', function(req, res) {
  kafka.make_request('searchbiddedproject', req.body, function(err, rows){
    if (err) throw err;
    res.json({rows : rows.rows})
  });
});
////////////////////////////////////////////////////////

app.post('/filterstatus', function(req, res) {
  kafka.make_request('filterstatus', req.body, function(err, rows){
    if (err) throw err;
    res.json({rows : rows.rows})
  });
});
/////////////////////////////////////////////////////

app.post('/biddingfilterstatus', function(req, res) {
  kafka.make_request('biddingfilterstatus', req.body, function(err, rows){
    if (err) throw err;
    res.json({rows : rows.rows})
  });
});
//////////////////////////////////////////////////////

app.post('/addbid', function(req, res) {
  kafka.make_request('addbid', req.body, function(err, rows){
    if (err) throw err;
    else{ res.json({bid_added:true}) }
  });
});
///////////////////////////////////////////////////

app.post('/projectprogress', function(req, res) {
  var project  = new projects;
  let form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
  let { path: tempPath, originalFilename } = files.file[0];
  var fileType = originalFilename.split(".");
  var fileName = Date.now() + '.' + fileType[fileType.length - 1]


    mongoose.connect(url, function(err, db) {
    if (err) throw err;
    else{
      console.log("Hello")
      console.log(fields.project_id[0])
      console.log(fields.comment[0])
      console.log(fields.hired_bidder[0])
      var myobj = { project_id : fields.project_id[0], comment : fields.comment[0], bidder_email : fields.hired_bidder[0], filename : fileName};
      db.collection("projects").update(
        { project_id : fields.project_id[0] },
        { $push: { progress : myobj} }
      )
      let copyToPath = "./src/files/" + fileName;
            fs.readFile(tempPath, (err, data) => {
              if (err) throw err;
              fs.writeFile(copyToPath, data, (err) => {
                if (err) throw err;
                fs.unlink(tempPath, () => {
                });
                res.json({progress_added : true});
              });
            });
    }
    });
  })
});


app.post('/balanceupdate', function(req, res) {
  kafka.make_request('balanceupdate', req.body, function(err, rows){
    if (err) throw err;
    else{ res.json({data_inserted:true}) }
  });
});
///////////////////////////////////////////////////

app.post('/withdrawbalance', function(req, res) {
  kafka.make_request('withdrawbalance', req.body, function(err, rows){
    if (err) throw err;
    else{ res.json({data_inserted:true}) }
  });
});
////////////////////////////////////////////////////

app.post('/transfermoney', function(req, res) {
  kafka.make_request('transfermoney', req.body, function(err, rows){
    if (err) throw err;
    else{ res.json({data_inserted:true}) }
  });
});
///////////////////////////////////////////////////

app.post('/transactionhistory', function(req, res) {
  kafka.make_request('transactionhistory', req.body, function(err, rows){
    if (err) throw err;
    else{ res.json({rows: rows.rows[0]}) }
  });
});
/////////////////////////////////////////////////////

var port = process.env.API_PORT || 3001;

app.listen(port, function() {
  console.log('SignUp process listening on port '+ port);
});