import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import GameRoomCard from "./GameRoomCard";
import AppBar from "../Utilities/AppBar";
import axios from "axios";
import {UserContext} from "../Contexts/UserContext";
import {GameContext} from "../Contexts/GameContext";
var dotenv = require('dotenv').config();


const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
});

class PaperSheet extends Component {
  constructor(props) {
    super();
     const { classes } = props;
      this.state= {
        location: {},
        circuit: {
            circuit_boundaries: {},
            challenges: [{
              location_gate:{
                name:'init'
              }
            }]
          }
      }
  }


  componentWillMount() {
    //var userId = this.props.context.userId;
    var userId = '5c0ff7bc64e17777e313ac23';
    var roomName = '';
    //get a list of circuits that match a user's boundary:
    axios.post(process.env.REACT_APP_BACK_END_SERVER + 'getCircuits/', {_id: userId}).then(
      (res) => {
        var circuit = res.data;
        console.log("server returned circuit info: ", circuit);
        console.log("first challenge: ", circuit.challenges[0]);
        console.log("number of people who have completed challenge 1: ", circuit.challenges[0].id_users_completed.length);
        roomName = circuit._id;
        console.log("room name / circuit id: " + roomName);
        console.log("this inside post call ", this);
        this.setState({
          circuit: circuit
        });
        //TODO set corresponding game circuit object through GameProvider

      }).catch(function(err){
        console.error(err);
        //add circuit if can't find: (NOT WORKING CURRENTLY)
        /*if(err.response.status == 404){
          axios.post(process.env.REACT_APP_BACK_END_SERVER + 'addCircuit/', {_id: userId}).then(
          function(res){
            console.log(res);
            roomName = res.data[0]._id;

          }).catch(function(err){
            console.error(err);
          });
        }*/
      });

  }


  render() {

    return (
      <div>
        <AppBar />
        <Paper elevation={1}>
          <br />
          <Typography variant="h5" component="h3" align="center">
            GAME ROOM
          </Typography>
          <GameContext.Consumer>{
              (game) => ( //can rewrite this as (userProviderState) => () if that's more clear
                <div>
                  <Typography variant="h4" gutterBottom>
                    User Name: {game.user.username}
                  </Typography>
                </div>
              )
            }</GameContext.Consumer>
            <GameContext.Consumer>{
                (game) => (
                  <Typography variant="h6" gutterBottom>
                    {
                      /*conditional operator says if doesn't exist, display nothing*/
                      game.circuit.challenges[1] ? 'Second Challenge: '+ game.circuit.challenges[1].full_challenge_text : ''
                    }
                  </Typography>
                )
            }</GameContext.Consumer>
             <GameRoomCard />
        </Paper>
      </div>
    );
  }

}

PaperSheet.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PaperSheet);
