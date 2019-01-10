//missoula downtown box: -114.002828,46.862835,-113.971287,46.875845
//gecko designs: -113.9954051487,46.8738712158,-113.9908733052,46.8753916299
//mtcs: -113.9785716888,46.864083134,-113.9737311397,46.8668158202


// best cats -113.9974272696,46.8699370868,-113.9868102063,46.8760597402
/*-----------------------------Latitude---------------------------------*/
var latitudeArray = [46.8699370868, 46.8760597402];


/*-----------------------------Longitude---------------------------------*/


var longitudeArray = [-113.9974272696, -113.9868102063];

var express = require('express');
var router = express.Router();
var User = require('../models/user');

function returnBB(longitude, latitude) {
    var lat = latitude;
    var long = longitude;
    var latBounds = [];
    var longBounds = []
    //go through and find high and low bounds, push them to lat/long bounds.
    //first value in each array is upper bound, second value is lower
    if (latitudeArray.indexOf(lat) == true) {
      lat += .01;
    }
    if (longitudeArray.indexOf(long) == true) {
      long += .01;
    }
    for (var i = 0; i < latitudeArray.length; i++) {
      if (latitudeArray[i] > lat){
        latBounds.push(latitudeArray[i]);
        latBounds.push(latitudeArray[i-1]);
        break;
      }
      //error if reach last value
      else if (latitudeArray[i] >= 90){
        console.log("cannot find latitude");
      }
    }
    for (var i = 0; i < longitudeArray.length; i++) {
      if (longitudeArray[i] > long){
        longBounds.push(longitudeArray[i]);
        //west = longitudeArray[i].toFixed(6);
        longBounds.push(longitudeArray[i-1]);
        break;
      }
      else if (longitudeArray[i] >= 180){
        console.log("cannot find longitude");
      }
    }
    var west = parseFloat(longBounds[1]),
        south = parseFloat(latBounds[1]),
        east = parseFloat(longBounds[0]),
        north = parseFloat(latBounds[0]);
    console.log("w: " + west + " s: " + south + " e: " + east + " n: " + north);
    return [west,south,east,north];
}
/*

addUser takes a POST request specifying a new user's req.body to add a new user
to the database and calculates the user's boundary box for Here/matchmaking
here is how the request should look:
req = { username: 'username',
        latitude: number,
        longitude: number
      }
latitude and longitude are automatically collected by the browser in DialogBox.js

*/

router.post('/', function (req, res) {
    console.log('add user accessed');
    var data = req.body;
    console.log("added: " + data.username);
    console.log("New user location, longitude: "+ data.longitude+ ", latitude: " + data.latitude);
    var bbounds = returnBB(data.longitude, data.latitude);
    for (var i = 0; i < bbounds.length; i++){
      if (isNaN(bbounds[i])){
        console.log("user outside boundary!!!");
        res.status(200).send(
          {findUser: false}
        );
        return;
      }
    }
    console.log("BBounds returned: " + bbounds);
    new User({
      username:data.username,
      //avatar:data.avatar_link, //string to image location in server / public
      current_user_location: {
        type: "Point",
        coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)] //[-113.98274, 46.87278]
      },
      user_session_boundary: {
        here_api_format: bbounds
      }
    }).save(function (err, user) {
        if (err) {
              console.log(err);
              res.sendStatus(400);
            }
        console.log("Sending user id back to client");
        res.status(200).send(
          {
            userId: user._id,
            findUser: true
          }
          );
    });
    //res.sendStatus(200);
});

module.exports = router;
