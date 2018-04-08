var mysql = require('mysql');
var bodyParser = require('body-parser');
var Parser = require('expr-eval').Parser;
var express = require('express');
var app = express();
var multiparty = require('multiparty');
var fs = require('fs');
var mongo = require('mongodb');
var mongoose = require('mongoose');

var users = require('./src/freelancer/models/users');
var projects = require('./src/freelancer/models/projects');
var project_bids = require('./src/freelancer/models/project_bids');
var transactions = require('./src/freelancer/models/transaction');

var url = "mongodb://root:2131@ds231749.mlab.com:31749/freelancer"

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});  


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

app.post('/signupprocess', function(req, res) {

  var bcrypt = require('bcrypt');
  const saltRounds = 10;
  // console.log(req.body)
  mongoose.connect(url, function(err, db) {
    if (err) res.json({logged_in:false});
    else{
      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          var myobj = { name: req.body.name, email : req.body.email, password: hash, profile_image:null, balance:0, assigned_project_id : [] };
          db.collection("users").insertOne(myobj, function(err, result) {
            if (err) {
              console.log(err);
              res.json({logged_in:false});
            }
            else{
              db.collection("tranaction").insertOne(
                { email : req.body.email }
              )
            // db.close();
            res.json({logged_in:true, result:req.body.name});
            }
          });
        });
      });
    }
  });
});

app.post('/signinprocess', function(req, res) {
  var bcrypt = require('bcrypt');
  const saltRounds = 10;
  mongoose.connect(url, function(err, db) {
    if (err) res.json({user_exist : false});
    else{
      bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          var myobj = { email : req.body.email, password: hash };
          db.collection("users").findOne(myobj, function(err, result) {
            if (err) {
              console.log(err);
              res.json({logged_in:false});
            }
            else{
            // db.close();
            db.collection("users").find({email : req.body.email}).toArray( function(err, result) {
              res.json({logged_in:true, result:result[0].name});
            });
            }
          });
        });
      });
    }
  });

});

app.post('/addproject', function(req, res) {
    // console.log(req.body.username)
    var project  = new projects;
    let form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
    let { path: tempPath, originalFilename } = files.file[0];
    var fileType = originalFilename.split(".");
    var fileName = Date.now() + '.' + fileType[fileType.length - 1]


      mongoose.connect(url, function(err, db) {
      if (err) throw err;
      else{
        console.log(project.id)
        var myobj = { project_id : project.id, days:0, title: fields.name[0] , description : fields.description[0], skills_required: fields.skills[0], employer:fields.email[0], budget_range:fields.range[0], file:fileName, status : "PENDING" };

        db.collection("projects").insertOne(myobj, function(err, result) {
          if(err){
            res.json({project_added:false});
          }
          else{
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
        });
      }
      });
    })
});

app.post('/profilefetch', function(req, res) {
  mongoose.connect(url, function(err, db) {
    if (err) throw err;

    else{
      db.collection("users").find({email : req.body.email}).toArray(function(err, rows){
        if(!err){
          res.json({rows : rows[0]})
        }
        else{
          res.json({logged_in:false})
        }
      })
    }
  });

});

app.post('/bidderfetch', function(req, res) {
  console.log(req.body.username)
  connection.query("SELECT * from users where username = ?",req.body.username,function(err, rows) {
    if(rows.length>=1){
      res.json({rows : rows[0]})
    }
    else{
      res.json({logged_in:false})
    }
  });

});

app.post('/profileupdate', function(req, res) {
  // // console.log(req.body)
  // var sql = "update users SET name = '"+req.body.name+"', phone_number = '"+req.body.phone_number+ "', skills = '"+req.body.skills + "', about_me = '"+req.body.about_me +"' WHERE username = '"+ req.body.username+"'";  
  // connection.query(sql,  function(err, result) {
  //   res.json({data_inserted:true});
  // });
  mongoose.connect(url, function(err, db) {
    if (err) throw err;
    else{
      db.collection("users").update({email : req.body.email}, { $set: {name : req.body.name , phone_number : req.body.phone_number , skills : req.body.skills , about_me : req.body.about_me}}, function(err, rows){
        if(!err){
          res.json({data_inserted:true});
        }
        else{
          res.json({data_inserted:false})
        }
      })
    }
  });

});


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

var mysql = require('mysql');

var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : '2131',
  database : 'freelancer'
});

// pool.getConnection(function(err, connection) {
//   // connected! (unless `err` is set)
// });



app.post('/userprojects', function(req, res) {

  mongoose.connect(url, function(err, db) {
    if (err) throw err;

    else{
      db.collection("projects").find({employer : req.body.email}).toArray(function(err, rows){
        if(!err){
          res.json({rows : rows, status: 200})
        }
        else{
          res.json({logged_in:false})
        }
      })
    }
  });

});
app.post('/projectbidcount', function(req, res) {
  mongoose.connect(url, function(err, db) {
    if (err) throw err;
    else{
      db.collection("project_bids").find({project_id: req.body.project_id}).toArray(function(err, result){
          if(!err && typeof result[0] !== "undefined"){
              res.json({total_bids:result.length})
          }else{
              res.json({result:null})
          }
      });
    }
  });

});

app.post('/hirebidder', function(req, res) {
  var email = req.body.bidder_email
  var project_id = req.body.project_id
  mongoose.connect(url, function(err, db) {
    if (err) throw err;
    else{
      db.collection("projects").update({project_id : req.body.project_id}, { $set: {status: 'ON GOING', hiredbidder : req.body.bidder_email , hiredbiddername : req.body.bidder_name}}, function(err, rows){
        if(!err){
          console.log(project_id)
          db.collection("users").update(
            { email : email },
            { $push: { assigned_project_id : project_id} }
          )
          // db.collection("users").update({email : email}, { $push: { assigned_project_id : req.body.project_id } }, function(err, rows){
          //   if(!err){
          //     res.json({bidder_hired:true});
          //   }
          //   else{
          //     res.json({bidder_hired:false})
          //   }
          // })
        }else{
          res.json({bidder_hired:false})
        }
      })
    }
  });


});

app.post('/biddersfetch', function(req, res) {

  mongoose.connect(url, function(err, db) {
    if (err) throw err;

    else{
      db.collection("project_bids").find({project_id : req.body.project_id}).toArray(function(err, rows){
        if(!err){
          res.json({rows : rows, status: 200})
        }
        else{
          res.json({logged_in:false})
        }
      })
    }
  });

});

app.post('/userbids', function(req, res) {
  mongoose.connect(url, function(err, db) {
    if (err) throw err;

    else{
      db.collection("project_bids").find({bidder_email : req.body.email}).toArray(function(err, rows){
        if(!err){
          res.json({rows : rows, status: 200})
        }
        else{
          res.json({logged_in:false})
        }
      })
    }
  });
});


app.post('/projectsfetch', function(req, res) {
  mongoose.connect(url, function(err, db) {
    if (err) res.json({logged_in:false})
    else{
      db.collection("projects").find().toArray(function(err, rows){
        if(!err){
          res.json({rows : rows})
        }
        else{
          res.json({logged_in:false})
        }
      })
      
    }
  });
    
});

app.post('/projectfetch', function(req, res) {
  mongoose.connect(url, function(err, db) {
    if (err) res.json({logged_in:false})
    else{
      // console.log(req.body.project_id)
          db.collection("projects").find({project_id : req.body.project_id}).toArray(function(err, rows){
            if(!err){
              // console.log(rows)
              db.collection("project_bids").aggregate(
                [ { $match: {"project_id": req.body.project_id }},
                  {
                    $group:
                      {
                        _id: "$project_id",
                        avg: { $avg: "$days" }
                      }
                  }
                ]).toArray(function(err, result){
                  // console.log(result)
                  if(!err && typeof result[0] !== "undefined"){
                      res.json({rows:rows[0], result:result[0].avg.toFixed(2)})
                  }else{
                      res.json({rows:rows[0], result:null})
                  }
              });
            }
            else{
              res.json({logged_in:false})
            }
      });
  }
  });
});

app.post('/searchprojects', function(req, res) {
  mongoose.connect(url, function(err, db) {
    if (err) res.json({logged_in:false})
    else{
      db.collection("projects").aggregate(
        [ 
          { $match: 
                { $or: 
                  [ { "title" : { $regex:  req.body.search_data, $options: "i"} }, 
                    { "skills_required": { $regex:  req.body.search_data, $options: "i"} },
                    { "employer": { $regex:  req.body.search_data, $options: "i"} },
                    { "status": { $regex:  req.body.search_data, $options: "i"} }
                  ] 
                }
          }
        ]).toArray(function(err, rows){
        if(!err && rows.length!==0){
          console.log(rows)
          res.json({rows : rows})
        }
        else{
          res.json({rows : null})
        }
      })
      
    }
  });

});


app.post('/filterstatus', function(req, res) {
  mongoose.connect(url, function(err, db) {
    if (err) res.json({logged_in:false})
    else{
      db.collection("projects").aggregate(
        [ 
          { $match: 
            { $and : [
              { "status" : { $regex:  req.body.search_data} } ,
              { "employer": { $regex:  req.body.employer} }
            ]}
          }
        ]).toArray(function(err, rows){
        if(!err && rows.length!==0){
          res.json({rows : rows})
        }
        else{
          res.json({rows : null})
        }
      })
      
    }
  });

});


app.post('/addbid', function(req, res) {
  var project_bid  = new project_bids;
  console.log(req.body.project_data)
  mongoose.connect(url, function(err, db) {
    if (err) res.json({logged_in:false})
    else{
      var myobj = {project_data : req.body.project_data, bid_id : project_bid.id, project_id: req.body.project_id, days : Number(req.body.days), usd: req.body.usd, bidder_name : req.body.bidder_name, bidder_email: req.body.bidder_email};
      db.collection("project_bids").insertOne(myobj, function(err, result) {
        if(!err){
          res.json({bid_added: true})
        }
        else{
          res.json({bid_added:false})
        }
      })
    }
  });

});

app.post('/balanceupdate', function(req, res) {
  mongoose.connect(url, function(err, db) {
    if (err) throw err;
    else{
      db.collection("users").find({email : req.body.email}).toArray(function(err, rows){
        if(!err){
          console.log(rows)
          console.log(rows[0].balance)
          console.log(Number(rows[0].balance) + Number(req.body.amount))
          var transaction = {name_on_card : req.body.name_on_card , card_number : req.body.card_number , expiry_date : req.body.expiry_date , amount : req.body.amount}
          db.collection("users").update({email : req.body.email}, { $set: {balance : rows[0].balance === null ? Number(req.body.amount) : Number(rows[0].balance) + Number(req.body.amount), transaction } }, function(err, rows){
            if(!err){
              db.collection("tranaction").update(
                { email : req.body.email },
                { $push: { transaction_details : transaction } }
              )
              res.json({data_inserted:true});
            }
            else{
              res.json({data_inserted:false})
            }
          })

        }
        else{
          res.json({data_inserted:false})
        }
      })
    }
  });

});


var port = process.env.API_PORT || 3001;

app.listen(port, function() {
  console.log('SignUp process listening on port '+ port);
});