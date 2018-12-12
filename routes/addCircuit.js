var express = require('express');
var router = express.Router();
const axios = require('axios');
var Circuit = require('../models/circuit');
var User = require('../models/user'); //included to be able to search users
const haversine = require('haversine');
var dotenv = require('dotenv').config();
/*
on Client side:
check to see if there are available circuits in the area,
if not, use this route to create a circuit
axios(getCircuits).then(if (headerResponse == 401)){
  axios(addCircuit)...
});

addCircuit takes a request specifying a user's body._id to create a circuit to join
in that area defined by the user's assigned user box (assignUserBox)

In the server call we go to the Here API and also use a synonym library to
generate a list of challenges bound within the user polygon

*/
router.post('/', function (req, res) {
    console.log('==========================new add circuit accessed '+new Date()+' ==============================================');
    process_request(req);
    res.sendStatus(200);
});

function process_request(req) {
    var data = req.body;
    //access user's user_session_boundary and create an API call to Here
    //so use findbyId() for data._id
    //here requires a west, south, east, north boundary
    var apiBoundingBox, circuitBoundaries;
    User.findById(data._id, function (err, user) {
      if(err){
        console.error(err);
        return;
      }
      var bounds = user.user_session_boundary.here_api_format;
      apiBoundingBox = bounds[0]+','+bounds[1]+','+bounds[2]+','+bounds[3];
      circuitBoundaries = bounds;
    }).then(function(){
      //INSERT API KEY FROM GOOGLE DOCS HERE, REMEMBER TO DELETE BEFORE COMMITS
      var apiCategories = [
                            'leisure-outdoor','landmark-attraction','going-out',
                            'eat-drink', 'natural-geographical', 'sights-museums'
                          ];
      var cat = apiCategories[Math.floor(Math.random()*apiCategories.length)];
      var api = process.env.HERE_API+ apiBoundingBox +'&cat='+cat;
      //maybe do a 'pub crawl' version of this? Photo yourself in the bar with your drink (can Rekognition see full/empty glasses? yes), drink it and move on to the next bar

      console.log("findbyId finished, Here API call starting...");
      axios.get(api)
        .then(response => { //keep in mind, we're still in the UserfindbyId promise
          var places = response.data.results.items;
          //push POIs and random objects to list challenges
          var sets_challenges = [];
          console.log("Places found: " + places.length);
          for(var i = 0; i < places.length; i++) {
            var words = ['keys', 'flower', 'clock', 'newspaper', 'wallet', 'soda can', 'carrot', 'banana', 'milk', 'watch', 'magnet', 'CD', 'shoe','flag'];
            var objectGate = words[Math.floor(Math.random()*words.length)];
            sets_challenges[i] = {
              location_gate:{
                position: places[i].position,
                name: places[i].title,
                address: places[i].vicinity,
                category: places[i].category.id
                },
              object_gate: objectGate
            };
          }
          //create the new circuit
          new Circuit({
            circuit_boundaries: circuitBoundaries,
            challenges: sets_challenges,
            date_created: new Date(),
          }).save(function (err) {
              if (err) {
                  if (err.code === 11000) {
                      // 11000 : Error code for duplicate entry with same primary key. Even though we will update the table to fill different events users attended.
                      console.log("Duplicate circuit for collection. Skipping entry.")
                  }
                  else {
                    console.log(err);
                  }
              } else {
                  console.log("New Circuit Saved to Database");
              }
          });

          //route is only accessed if
          //someone is not already hosting a circuit. But the 2:00 counter is
          //only triggered when this user (or another user, just as long as the
          //room size > 0) joins a room with the same name/id as the circuit
        })
        .catch(error => {
          console.log(error);
        });
      });
}

module.exports = router;
