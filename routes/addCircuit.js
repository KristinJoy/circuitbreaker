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
    var data = req.body;
    //access user's user_session_boundary and create an API call to Here
    //so use findbyId() for data._id
    //here requires a west, south, east, north boundary
    var apiBoundingBox, circuitBoundaries;
    User.findById(data.userId, function (err, user) {
      if(err){
        console.error(err);
        return;
      }

    }).then((user) => {
      console.log("User info after found in addCircuit: ", user);
      console.log("Boundary for Here API: ", user.user_session_boundary.here_api_format);
      var bounds = user.user_session_boundary.here_api_format;
      apiBoundingBox = bounds[0]+','+bounds[1]+','+bounds[2]+','+bounds[3];
      circuitBoundaries = bounds;
      var apiCategories = [
                            /*'going-out'*/
                            /*'restaurant'*/
                            '9532'
                          ];
      var cat = apiCategories[Math.floor(Math.random()*apiCategories.length)];
      var q = /*'pub'*/ /*'tavern'*/ /*'night-club'*/ 'beer-drink';
      var api = process.env.HERE_API+ apiBoundingBox +'&cat='+cat;
      var searchAPI = process.env.HERE_API_SEARCH + apiBoundingBox +'&q='+q;
      //maybe do a 'pub crawl' version of this? Photo yourself in the bar with your drink (can Rekognition see full/empty glasses? yes), drink it and move on to the next bar

      console.log("findbyId finished, Here API call starting w/ bounds...", apiBoundingBox);
      axios.get(searchAPI)
        .then(response => { //keep in mind, we're still in the UserfindbyId promise
          var places = response.data.results.items;
          //push POIs and random objects to list challenges
          var sets_challenges = [];
          for (var i = 0; i < places.length; i++){
            //if(places[i].category.id === 'bar-pub'){
              console.log(i + ") " + JSON.stringify(places[i]));
            //}
          }
          console.log("Places found: " + places.length);
          //which is longer, 10 or place.length...

          var challengeLimit = 20; //set to number of challenges you want...
          for(var i = 0; i < challengeLimit; i++) {
            if(places[i].category.id == 'wine-and-liquor' ||  places[i].category.id == 'shop'){
              console.log("category wine or liquor found, returning");
              places.splice(i,1);
              challengeLimit--;
            }
            else {
              console.log(i + ") passed");
            }
          }

          if (places.length < challengeLimit){
            challengeLimit = places.length;
          }
            for(var i = 0; i < challengeLimit; i++) {
               var words = [
                 'glass'
               ];
              var objectGate = words[Math.floor(Math.random()*words.length)];
              var fullText = 'Hop to ' + places[i].title + ' and take a selfie with your empty glass.';
              sets_challenges[i] = {
                location_gate:{
                  position: places[i].position,
                  name: places[i].title,
                  address: places[i].vicinity,
                  category: places[i].category.id
                  },
                object_gate: objectGate,
                full_challenge_text: fullText,
                id_users_completed: ''
              };
          }
          console.log("sets challenges length before shuffle: ", sets_challenges.length);
          // var passChallenges = shuffle(sets_challenges);
          var passChallenges = sets_challenges.slice(0, 3);
          console.log("shuffled challenge 0: ", passChallenges[0]);
            //create the new circuit
            new Circuit({
              circuit_boundaries: circuitBoundaries,
              challenges: passChallenges,//sets_challenges,
              date_created: new Date(),
            }).save(function (err, circuit) {
              if(err){console.log(err);}
              console.log("New Circuit Saved to Database");
                    //TODO: make it so that this route returns the circuit information
                    res.status(200).send(circuit);
            });//write catch block
            //route is only accessed if
            //someone is not already hosting a circuit. But the 2:00 counter is
            //only triggered when this user (or another user, just as long as the
            //room size > 0) joins a room with the same name/id as the circuit
        })
        .catch(error => {
          console.log(error);
        });
      });
});


module.exports = router;
