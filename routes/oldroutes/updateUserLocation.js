var express = require('express');
var router = express.Router();
var User = require('../models/user');

/*

updateUserLocation takes a request specifying the body._id to search by,
then the body.longitude and body.latitude to update with.

It also assigns an updatedAt key to the current_user_location object that is
generated every time the route is accessed

*/
router.put('/', function(req, res){
  var data = req.body;
  var query = data._id;
  var update = {
      current_user_location: {
        type: "Point",
        coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)], //[-113.98274, 46.87278]
        updatedAt: new Date()
      }
    };
  var options = {new: true};
  console.log(data);
  //User.findOneAndUpdate() also works in this situation
  User.findByIdAndUpdate(
    query, //_id
    update, // new long and lat
    options, //add if doesn't exist
    function(err, documents){
    if(err){
      console.log(err);
    } else{
     res.send(data);
     console.log(data);
    }
  });
});

module.exports = router;
