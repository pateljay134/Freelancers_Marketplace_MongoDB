var connection =  new require('./kafka/Connection');
var login = require('./services/login');

var topic_name = 'login_topic';
var consumer = connection.getConsumer(topic_name);
var producer = connection.getProducer();

var mongoose = require('mongoose');

const nodemailer = require('nodemailer');

var users = require('../src/freelancer/models/users');



var projects = require('../src/freelancer/models/projects');
var project_bids = require('../src/freelancer/models/project_bids');
var transactions = require('../src/freelancer/models/transaction');



mongoose.connect("mongodb://root:2131@ds231749.mlab.com:31749/freelancer");
var url = "mongodb://root:2131@ds231749.mlab.com:31749/freelancer"


var db;
mongoose.connect(url, function(err, database) {
  if(err) throw err;
  console.log(database)
  db = database;
  // users_profile = db.collection("users");
  // console.log(db);
});



var projectsfetch = connection.getConsumer('projectsfetch');
var projectfetch = connection.getConsumer('projectfetch');
var addproject = connection.getConsumer('addproject');
var profilefetch = connection.getConsumer('profilefetch');
var userprojects = connection.getConsumer('userprojects');
var userbids = connection.getConsumer('userbids');
var balanceupdate = connection.getConsumer('balanceupdate');
var withdrawbalance = connection.getConsumer('withdrawbalance');
var transfermoney = connection.getConsumer('transfermoney');
var addbid = connection.getConsumer('addbid');
var biddersfetch = connection.getConsumer('biddersfetch');
var searchprojects = connection.getConsumer('searchprojects');
var searchuserprojects = connection.getConsumer('searchuserprojects');
var searchbiddedproject = connection.getConsumer('searchbiddedproject');
var filterstatus = connection.getConsumer('filterstatus');
var biddingfilterstatus = connection.getConsumer('biddingfilterstatus');
var hirebidder = connection.getConsumer('hirebidder');
var projectbidcount = connection.getConsumer('projectbidcount');
var profileupdate = connection.getConsumer('profileupdate');
var transactionhistory = connection.getConsumer('transactionhistory');


console.log('server is running');
consumer.on('message', function (message) {
    console.log('message received');
    console.log(JSON.stringify(message.value));
    var data = JSON.parse(message.value);
    login.handle_request(data.data, function(err,res){
        console.log('after handle'+res);
        var payloads = [
            { topic: data.replyTo,
                messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : res
                }),
                partition : 0
            }
        ];
        producer.send(payloads, function(err, data){
            console.log(data);
        });
        return;
    });
});


projectsfetch.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    mongoose.connect(url, function(err, db) {
    if (err) res.json({logged_in:false})
    else{
      db.collection("projects").find().sort({ budget_range: -1 }).toArray(function(err, rows){
        if(!err){
            var payloads = [
              { topic: data.replyTo,
                  messages:JSON.stringify({
                    correlationId:data.correlationId,
                    data : rows
                  }),
                partition : 0
              }
            ];
            producer.send(payloads, function(err, data){
            });
        }
      })
      
    }
  });
});


projectfetch.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    mongoose.connect(url, function(err, db) {
              db.collection("projects").find({project_id : values.project_id}).toArray(function(err, rows){
                if(!err){
                  db.collection("project_bids").aggregate(
                    [ { $match: {"project_id": values.project_id }},
                      {
                        $group:
                          {
                            _id: "$project_id",
                            avg: { $avg: "$days" }
                          }
                      }
                    ]).toArray(function(err, result){
                      if(!err && typeof result[0] !== "undefined"){
                        var project_data = {rows : rows, result: result}
                        var payloads = [
                          { topic: data.replyTo,
                              messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : project_data
                              }),
                            partition : 0
                          }
                        ];
                        producer.send(payloads, function(err, data){
                        });
                      }else{
                        var project_data = {rows : rows, result:null}
                        var payloads = [
                          { topic: data.replyTo,
                              messages:JSON.stringify({
                                correlationId:data.correlationId,
                                data : project_data
                              }),
                            partition : 0
                          }
                        ];
                        producer.send(payloads, function(err, data){
                        });
                      }
                  });
                }
          });
      });
});

addproject.on('message', function(message){
    var data = JSON.parse(message.value);
    var project_data = data.data
    var project  = new projects;
    mongoose.connect(url, function(err, db) {
            if (err) throw err;
            else{
                db.collection("projects").insertOne(project_data, function(err, result) {
                if(err) throw err;
                else {
                    var payloads = [
                        { topic: data.replyTo,
                            messages:JSON.stringify({
                              correlationId:data.correlationId,
                              data : {project_added : true}
                            }),
                          partition : 0
                        }
                      ];
                      producer.send(payloads, function(err, data){
                      });
                }
                });
            }
        })
  });


profilefetch.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    mongoose.connect(url, function(err, db) {
      if (err) res.json({logged_in:false})
      else{
          db.collection("users").find({email : values.email}).toArray(function(err, rows){
            if(!err){
              console.log("Sending User's data")
              var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                      correlationId:data.correlationId,
                      data : rows[0]
                    }),
                  partition : 0
                }
              ];
              producer.send(payloads, function(err, data){
              });
            }
          })
        }})
  });

userprojects.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    mongoose.connect(url, function(err, db) {
        if (err) throw err;
    
        else{
          db.collection("projects").find({employer : values.email}).toArray(function(err, rows){
            if(!err){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                          correlationId:data.correlationId,
                          data : rows
                        }),
                      partition : 0
                    }
                  ];
                  producer.send(payloads, function(err, data){
                  });
            }
          })
        }
      });
  });

userbids.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    mongoose.connect(url, function(err, db) {
        if (err) throw err;
        else{
          db.collection("project_bids").find({bidder_email : values.email}).toArray(function(err, rows){
            if(!err){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                          correlationId:data.correlationId,
                          data : rows
                        }),
                      partition : 0
                    }
                  ];
                  producer.send(payloads, function(err, data){
                  });
            }
          })
        }
      });
  });

balanceupdate.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    console.log(values)
    mongoose.connect(url, function(err, db) {
        if (err) throw err;
        else{
          db.collection("users").find({email : values.email}).toArray(function(err, rows){
            if(!err){
              var transaction = {name_on_card : values.name_on_card , card_number : values.card_number , expiry_date : values.expiry_date , amount : values.amount}
              db.collection("users").update({email : values.email}, { $set: {balance : rows[0].balance === null ? Number(values.amount) : Number(rows[0].balance) + Number(values.amount), transaction } }, function(err, rows){
                if(!err){
                  db.collection("tranaction").update(
                    { email : values.email },
                    { $push: { transaction_details : transaction } }
                  )
                  var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                          correlationId:data.correlationId,
                          data : {data_inserted:false}
                        }),
                      partition : 0
                    }
                  ];
                  producer.send(payloads, function(err, data){
                  });
                }
              })
    
            }
          })
        }
      });
  });

withdrawbalance.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    console.log(values)
    mongoose.connect(url, function(err, db) {
        if (err) throw err;
        else{
            db.collection("users").find({email : values.email}).toArray(function(err, rows){
              var transaction = {bank_account : values.bank_account , routing_number : values.routing_number, amount : values.amount}
              db.collection("users").update({email : values.email}, { $set: {balance : rows[0].balance === (0 || null)? Number(values.amount) : Number(rows[0].balance) + Number(values.amount), transaction } }, function(err, rows){
                if(!err){
                  db.collection("tranaction").update(
                    { email : values.email },
                    { $push: { transaction_details : transaction } }
                  )
                  var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                          correlationId:data.correlationId,
                          data : {data_inserted:true}
                        }),
                      partition : 0
                    }
                  ];
                  producer.send(payloads, function(err, data){
                  });
                }
            })
        })          
    }})
});

transfermoney.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    console.log(values)
    
    mongoose.connect(url, function(err, db) {
        if (err) throw err;
        else{
          db.collection("users").find({email : values.email}).toArray(function(err, rows){
            var transaction = {bank_account : values.bank_account , routing_number : values.routing_number, amount : "-"+values.amount}
            db.collection("users").update({email : values.email}, { $set: {balance : rows[0].balance === 0? Number("-"+values.amount) : Number(rows[0].balance) + Number("-"+values.amount), transaction } }, function(err, rows){
              if(!err){
                db.collection("tranaction").update(
                  { email : values.email },
                  { $push: { transaction_details : transaction } }
                )
                db.collection("users").find({email : values.bidder_email}).toArray(function(err, rows){
                  var transaction = {bank_account : values.bank_account , routing_number : values.routing_number, amount : values.amount}
                  db.collection("users").update({email : values.bidder_email}, { $set: {balance : rows[0].balance === (0 || null)? Number(values.amount) : Number(rows[0].balance) + Number(values.amount), transaction } }, function(err, rows){
                    if(!err){
                      db.collection("tranaction").update(
                        { email : values.bidder_email },
                        { $push: { transaction_details : transaction } }
                      )
                      db.collection("projects").update(
                        { project_id : values.project_id },
                        { $set: {status: 'CLOSED'}}
                      )
    
                      db.collection("project_bids").update(
                        { project_id : values.project_id },
                        { $set: { "project_data.status" : "CLOSED"} }
                      )
                      var payloads = [
                        { topic: data.replyTo,
                            messages:JSON.stringify({
                              correlationId:data.correlationId,
                              data : {bid_added:true}
                            }),
                          partition : 0
                        }
                      ];
                      producer.send(payloads, function(err, data){
                      });
                    }
                  })
                })
              }
            })
          })     
    }})
});

addbid.on('message', function(message){
    console.log("Hello")
    var data = JSON.parse(message.value);
    var values = data.data;
    console.log(values)

    var project_bid  = new project_bids;
    mongoose.connect(url, function(err, db) {
        if (err) console.log(err)
        else{
        var myobj = {project_data : values.project_data, bid_id : project_bid.id, project_id: values.project_id, days : Number(values.days), usd: values.usd, bidder_name : values.bidder_name, bidder_email: values.bidder_email};
        db.collection("project_bids").insertOne(myobj, function(err, result) {
            if(!err){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                          correlationId:data.correlationId,
                          data : {bid_added:true}
                        }),
                      partition : 0
                    }
                  ];
                  producer.send(payloads, function(err, data){
                  });
            }
        })
        }
    });

});

biddersfetch.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    mongoose.connect(url, function(err, db) {
        if (err) throw err;
    
        else{
          db.collection("project_bids").find({project_id : values.project_id}).toArray(function(err, rows){
            if(!err){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                          correlationId:data.correlationId,
                          data : {rows : rows}
                        }),
                      partition : 0
                    }
                  ];
                  producer.send(payloads, function(err, data){
                  });
            }
          })
        }
      });

});

searchprojects.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    mongoose.connect(url, function(err, db) {
        if (err) console.log(err)
        else{
          db.collection("projects").aggregate(
            [ 
              { $match: 
                    { $or: 
                      [ { "title" : { $regex:  values.search_data, $options: "i"} }, 
                        { "skills_required": { $regex:  values.search_data, $options: "i"} },
                        { "employer": { $regex:  values.search_data, $options: "i"} },
                        { "status": { $regex:  values.search_data, $options: "i"} }
                      ] 
                    }
              }
            ]).toArray(function(err, rows){
            if(!err && rows.length!==0){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                          correlationId:data.correlationId,
                          data : {rows : rows}
                        }),
                      partition : 0
                    }
                  ];
                  producer.send(payloads, function(err, data){
                  });
            }
          })
          
        }
      });

});

searchuserprojects.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    mongoose.connect(url, function(err, db) {
        if (err) console.log(err)
        else{
          db.collection("projects").aggregate(
            [ 
              { $match: {$and : [ { $or: 
                [ { "title" : { $regex:  values.search_data, $options: "i"} }, 
                  { "skills_required": { $regex:  values.search_data, $options: "i"} },
                  { "status": { $regex:  values.search_data, $options: "i"} }
                ] 
              }, {"employer": { $regex:  values.email, $options: "i"} } 
            ]}   
              }
            ]).toArray(function(err, rows){
            if(!err && rows.length!==0){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                          correlationId:data.correlationId,
                          data : {rows : rows}
                        }),
                      partition : 0
                    }
                  ];
                  producer.send(payloads, function(err, data){
                  });
            }
          })
          
        }
      });
});

searchbiddedproject.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    mongoose.connect(url, function(err, db) {
        if (err) console.log(err)
        else{
          db.collection("project_bids").aggregate(
            [ 
              { $match: {$and : [ { $or: 
                [ { "project_data.title" : { $regex:  values.search_data, $options: "i"} }, 
                  { "project_data.skills_required": { $regex:  values.search_data, $options: "i"} },
                  { "project_data.status": { $regex:  values.search_data, $options: "i"} },
                  { "project_data.employer": { $regex:  values.search_data, $options: "i"} }
                ] 
              }, {"bidder_email": { $regex:  values.email, $options: "i"} } 
            ]}   
              }
            ]).toArray(function(err, rows){
            if(!err && rows.length!==0){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                          correlationId:data.correlationId,
                          data : {rows : rows}
                        }),
                      partition : 0
                    }
                  ];
                  producer.send(payloads, function(err, data){
                  });
            }
          })
          
        }
      });
});

filterstatus.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    mongoose.connect(url, function(err, db) {
        if (err) console.log(err)
        else{
          db.collection("projects").aggregate(
            [ 
              { $match: 
                { $and : [
                  { "status" : { $regex:  values.search_data} } ,
                  { "employer": { $regex:  values.employer} }
                ]}
              }
            ]).toArray(function(err, rows){
            if(!err && rows.length!==0){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                          correlationId:data.correlationId,
                          data : {rows : rows}
                        }),
                      partition : 0
                    }
                  ];
                  producer.send(payloads, function(err, data){
                  });
            }
          })
        }
      });
});

biddingfilterstatus.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    console.log(values.search_data)
    mongoose.connect(url, function(err, db) {
        if (err) console.log(err)
        else{
          db.collection("project_bids").aggregate(
            [ 
              { $match: 
                { $and : [
                  { "project_data.status" : { $regex:  values.search_data} } ,
                  { "bidder_email": { $regex:  values.employer} }
                ]}
              }
            ]).toArray(function(err, rows){
            if(!err ){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                          correlationId:data.correlationId,
                          data : {rows : rows}
                        }),
                      partition : 0
                    }
                  ];
                  producer.send(payloads, function(err, data){
                  });
            }
          })
          
        }
      });
});

hirebidder.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    var email = values.bidder_email
    var project_id = values.project_id
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
             user: 'nodemailerfreelancer@gmail.com',
             pass: 'Thejoker@13'
         }
     });
     const mailOptions = {
      from: 'nodemailerfreelancer@gmail.com',
      to: values.bidder_email,
      subject: 'You are hired for the project',
      html: '<p>Go, Start Earning Money<p>'
    };
      transporter.sendMail(mailOptions, (error, info) => {
          if (error)
              console.log(error);
      });
  
    mongoose.connect(url, function(err, db) {
      if (err) throw err;
      else{
        db.collection("projects").update({project_id : values.project_id, status : "PENDING" }, { $set: {status: 'ON GOING', hiredbidder : values.bidder_email , hiredbiddername : values.bidder_name}}, function(err, rows){
          if(!err){
            db.collection("users").update(
              { email : email },
              { $push: { assigned_project_id : project_id} }
            )
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                      correlationId:data.correlationId,
                      data : {bidder_hired:true}
                    }),
                  partition : 0
                }
              ];
              producer.send(payloads, function(err, data){
              });
          }
        })
      }
    });
  
});

projectbidcount.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    mongoose.connect(url, function(err, db) {
        if (err) throw err;
        else{
          db.collection("project_bids").find({project_id: values.project_id}).toArray(function(err, result){
            console.log(result.length)
              if(!err && typeof result[0] !== "undefined"){
                  console.log(result)
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                          correlationId:data.correlationId,
                          data : {project_id : result[0].project_id, total_bids:result.length}
                        }),
                      partition : 0
                    }
                  ];
                  producer.send(payloads, function(err, data){
                  });

                //   res.json({project_id : result[0].project_id, total_bids:result.length})
              }else{
                  console.log(result)
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                          correlationId:data.correlationId,
                          data : {result:null}
                        }),
                      partition : 0
                    }
                  ];
                  producer.send(payloads, function(err, data){
                  });
                //   res.json({result:null})
              }
          });
        }
      });
  
});

profileupdate.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    mongoose.connect(url, function(err, db) {
        if (err) throw err;
        else{
          db.collection("users").update({email : values.email}, { $set: {name : values.name , phone_number : values.phone_number , skills : values.skills , about_me : values.about_me}}, function(err, rows){
            if(!err){
                var payloads = [
                    { topic: data.replyTo,
                        messages:JSON.stringify({
                          correlationId:data.correlationId,
                          data : {data_inserted:true}
                        }),
                      partition : 0
                    }
                  ];
                  producer.send(payloads, function(err, data){
                  });
            }
          })
        }
      });
  
});

transactionhistory.on('message', function(message){
    var data = JSON.parse(message.value);
    var values = data.data;
    mongoose.connect(url, function(err, db) {
        if (err) throw err;
        else{
              db.collection("tranaction").find({email : values.email}).toArray(function(err, rows){
                if(!err){
                    var payloads = [
                        { topic: data.replyTo,
                            messages:JSON.stringify({
                              correlationId:data.correlationId,
                              data : {rows : rows}
                            }),
                          partition : 0
                        }
                      ];
                      producer.send(payloads, function(err, data){
                      });
                }
              })
            }
          });
  
});






