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

class GameRoom extends Component {
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
                  <Typography variant="h4" gutterBottom>
                    Coords: {game.user.user_session_boundary.here_api_format ? game.user.user_session_boundary.here_api_format: ''}
                  </Typography>
                   <GameRoomCard value={game}/>
                 </div>
                )
            }</GameContext.Consumer>

        </Paper>
      </div>
    );
  }

}

GameRoom.propTypes = {
  classes: PropTypes.object.isRequired
};

export default GameRoom;
