var connection =  new require('./kafka/Connection');
var login = require('./services/login');

var topic_name = 'login_topic';
var consumer = connection.getConsumer(topic_name);
var producer = connection.getProducer();

var mongoose = require('mongoose');

var users = require('../src/freelancer/models/users');



var projects = require('../src/freelancer/models/projects');
var project_bids = require('../src/freelancer/models/project_bids');
var transactions = require('../src/freelancer/models/transaction');




mongoose.connect("mongodb://root:2131@ds231749.mlab.com:31749/freelancer");
var url = "mongodb://root:2131@ds231749.mlab.com:31749/freelancer"


var projectsfetch_consumer = connection.getConsumer('projectsfetch');

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


projectsfetch_consumer.on('message', function(message){
    console.log("hello");
    // console.log(message.value)
    var data = JSON.parse(message.value);

    var values = data.data;
    console.log(values)
    mongoose.connect(url, function(err, db) {
    if (err) res.json({logged_in:false})
    else{

      db.collection("projects").find().sort({ budget_range: values.sort }).toArray(function(err, rows){
        if(!err){
            console.log(rows);
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

                      // db.collection("projects").find().toArray(function(err, rows){
                      //   if(!err){
                          // db.collection("project_bids").aggregate(
                          //     {
                          //       $group:
                          //         {
                          //           _id: "$project_id",
                          //           avg: { $avg: "$days" }
                          //         }
                          //     }).toArray(function(err, result){
                          //     if(!err && typeof result[0] !== "undefined"){
                          //       console.log(result)
                          //         res.json({rows:rows[0], result:result[0].avg.toFixed(2)})
                          //     }else{
                          //         res.json({rows:rows[0], result:null})
                          //     }
                          // });
                        // }
                        // else{
                        //   res.json({logged_in:false})
                        // }
                  // });
        }
        else{
        }
      })
      
    }
  });


      //db.close();
     
    // });
  });