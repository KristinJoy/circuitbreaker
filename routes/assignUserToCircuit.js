var express = require('express');
var router = express.Router();
var User = require('../models/user');

//hoping to code this so that when the getUser route is called from the
//user Provider in React that it takes the userId, returns the user's
//current user object as well as a current circuit object for the user
//if it exists

//so the data will be set in state on the client site by
//this.state.user: res.user,
//this.state.currentCircuit: res.circuit


/*when accessing getUser, take username then return _id:
* The /getUser route is defined in server.js
*/
router.put('/', function (req, res) {
  console.log("assigning user to circuit");
  console.log("req body " + JSON.stringify(req.body) + " @ " + new Date());
  var data = req.body;
  console.log("searching by " + data.userId);
  console.log("circuit id to add: ", data.circuit_id)
  //setting it to first name last name for now
  //passport should take care of this later for us
  User.findByIdAndUpdate(data.userId, {current_circuit_id: data.circuit_id}, {upsert: true, new: true}, function(err, user){
        if(err){console.log(err);}
        console.log("Assign user to circuit complete " + user);
        // console.log("user's new circuit id: " + user.current_circuit_id);
        res.status(200).send(user);
    }); //closes exec
}); //closes router.get

module.exports = router;
