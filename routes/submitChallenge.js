var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Circuit = require('../models/circuit');
const haversine = require('haversine');
var synonyms = require("synonyms");
var AWS = require('aws-sdk');
var dotenv = require('dotenv').config();
// var fs = require('fs');
var atob = require('atob');
// const vision = require('@google-cloud/vision');
// const client = new vision.ImageAnnotatorClient();
var Blob = require('blob');

function isWithinWinDistance(locationGateCoords, userCoords, unit, winDistance){
  var start = {};
  start.latitude = userCoords[0];
  start.longitude = userCoords[1];
  var end = {};
  end.latitude = locationGateCoords[0];
  end.longitude = locationGateCoords[1];
  var distance = haversine(start, end, {unit: unit});
  if(distance < winDistance) {
    console.log("CONGRATS! User is in the right place!");
    return true;
    // return true; //user is verified at the location!
  }
  else {
    console.log("SORRY! User is not within the required distance of the challenge location!");
    return false;
    // return false; //user is not within winDistance miles of poi
  }
  //this distance is returned as the crow flies:
  //return distance + " " + unit +"s";
}
function getBinary(base64Image) {
   var binaryImg = atob(base64Image);
   var length = binaryImg.length;
   var ab = new ArrayBuffer(length);
   var ua = new Uint8Array(ab);
   for (var i = 0; i < length; i++) {
     ua[i] = binaryImg.charCodeAt(i);
    }
    return ab;
}

router.put('/', function (req, res) {

  console.log("Submitting challenge at " + new Date());
  var data = req.body;
  var challengeId = data.challengeId;
  var options = {new: true};
  var distanceWin = isWithinWinDistance(data.location_to_check, data.user_position, "meter", 40000);
  var pictureFile = data.screenshot;
  var wordToCheck = data.check_word;
  var base64Image = pictureFile.split("data:image/jpeg;base64,")[1];
  var imageBytes = getBinary(base64Image);

  // AWS credentials for Detect labels API
  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.ACCESS_SECRET,
    region: 'us-west-2'
  });

  // Detecting Labels
  let rekognition = new AWS.Rekognition();
  rekognition.detectLabels({
    Image: {
      Bytes: imageBytes
    },
    MinConfidence: 50
  })
  .promise().then(function(res){
    let labelNames = [];
    for (var i = 0; i < res.Labels.length; i++) {
      labelNames.push(res.Labels[i].Name.toLowerCase());
    }
    if (labelNames.includes("face") && labelNames.includes(data.check_word) && distanceWin) {
      console.log("CONGRATS! User is within boundary and took an acceptable selfie with a", wordToCheck, "!");
    //TODO: add user Id to list of users who have completed challenge in question (data.challengeId)
    console.log("circuit id passed:", data.circuitId);
    console.log("challenge index to check on back end: ", data.challengeIndex);
    //let update = {challenges[data.challengeIndex].id_users_completed: 'new value'}
    Circuit.findById(data.circuitId)
    .then(function(circuit, err){
          console.log(err);
          circuit.challenges[data.challengeIndex].id_users_completed.push(data.userId);
          circuit.save();
          console.log('id of users completed in circuit in question', circuit.challenges[data.challengeIndex].id_users_completed);
          let winNumber = circuit.challenges.length;
          console.log("number of wins needed: ", winNumber);
          let completedNumber = 0;
          for (var i = 0; i < circuit.challenges.length; i++){
            if (circuit.challenges[i].id_users_completed.includes(data.userId)){
              completedNumber++;
            }
          }
          console.log("number of completed after check: ", completedNumber);
          if (completedNumber === winNumber){
            console.log("User has completed all challenges");
            res.status(200).send({
              message: "User has completed all challenges",
              userCompleted: true,
              circuitComplete: true
            });
          }
          res.status(200).send({
            message: "User has completed challenge" + data.challengeIndex,
            userCompleted: true,
            circuitComplete: false
          });
        });

    } else {
      console.log("SORRY, there is no match with", wordToCheck, "in the following detected items, OR photo is not a selfie: ", labelNames);
      res.status(404).send("SORRY, there is no match with", wordToCheck, "in the following detected items, OR photo is not a selfie: ", labelNames);
    }
  })
  .catch(function(err){
    console.error(err);
  });

  // Check to see if the user's ID appears in all other challenges of that same circuit. If so, tell the front end that the user broke the circuit, and game is over.



}); //closes router.put

module.exports = router;
