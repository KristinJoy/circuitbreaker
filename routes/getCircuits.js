var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Circuit = require('../models/circuit');
const haversine = require('haversine');
var synonyms = require("synonyms");
/*
getCircuits takes a GET request that specifies a request body with the following:
req{ user._id }

it searches current circuits by cicuit_boundaries to find a
user_session_boundary object that matches the req._id and returns a matching
circuit object

later on, socket.on('disconnect') {
 //move challenges_completed to past_challenges_completed
}
*/
//this function must be a POST because the promise callback on the client side
//returns a POST call to create a circuit if this route returns 404
router.post('/', function (req, res) {
  console.log("-------------------------new getting circuits @ "+new Date()+"---------------------------");
  var data = req.body;
  var userId = data._id;
  var hereBoundary;
  //search the user by provided id, then use the boundary to search circuits
  User.findById(userId, function (err, user) {
    hereBoundary = user.user_session_boundary.here_api_format;
  })
  .then(function(){
    console.log("getCircuit User ID Located... " + userId)
    //check if there are circuits in user boundary
    //that have not started more than 2 minutes ago
    /*&& (circuit.time_started + 120000) < new Date()*/
    Circuit.find({circuit_boundaries: hereBoundary}, function(err, circuit) {
      if(err){
        console.error(err);
      }
    }).then(function(circuit){
      if(circuit.length < 1) {
        console.log("no real circuits");
        //return 404 if no circuits, triggers addCircuit on front end
        res.status(404).send(404);
        return;
      }
      console.log("Circuit Found!");
      //remember that find returns an array of results, even if only one result,
      //access with circuit[0]
      res.status(200).send(circuit[0]);
    }).catch(function(err){
      console.error(err);
    });
  });
});

module.exports = router;
