var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Circuit = require('../models/circuit');
const haversine = require('haversine');
var synonyms = require("synonyms");
/*
getChallengeList takes a GET request that specifies a request body with the following:
req{ user._id, cirucit._id }

it returns an object of challenges with the following (hopefully sorted by
distance from the user):

circuit.challenges[0-10]{
    position, name, address, distance from user?
}

later on, socket.on('disconnect') {
 //move challenges_completed to past_challenges_completed
}
*/

//gonne need this
function getUserLocation(userId) {}
router.get('/', function (req, res) {
  console.log("getting challenges");
  var data = req.body;
  Circuit.findOne(_id, exec(
    function (err, user) {
      if(err) {
        console.log(err);
      }

      console.log(JSON.stringify(user.username) + "'s ID = " + JSON.stringify(user._id));
      res.status(200).send(JSON.stringify(user._id));
  }); //closes exec)
});

module.exports = router;
