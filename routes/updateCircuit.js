var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Circuit = require('../models/circuit');

//hoping to code this so that when the updateGameObject route is called from the
//GameProvider in React that it takes the userId, returns the user's
//current user object as well as a current circuit object for the user
//if it exists

//so the data will be set in state on the client site by
//this.state.user: res.user,
//this.state.currentCircuit: res.circuit

//this is a put route because it takes a request value to search by
router.put('/', function (req, res) {
  console.log("updating circuit information @ " + new Date() + "------------------------------");
  console.log("req body " + req + " @ " + new Date());
  var data = req.body.userId;
  console.log("searching by " + JSON.stringify(data));
  User.findById(data)
    .then(function (user) {
        Circuit.findById(user.current_circuit_id)
        .then(function (circuit, err) {
          if(err){console.log(err);}
          if(!circuit){
            console.log("no circuit found");
            res.status(404).send();
            return;//must include return to conclude promise
          }
          console.log(circuit);
          res.status(200).send(circuit);
        });
    }); //closes then
}); //closes router.get

module.exports = router;
