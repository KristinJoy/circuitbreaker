import React, { Component } from "react";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Grow from '@material-ui/core/Grow';
import Typography from "@material-ui/core/Typography";
import GameRoomCard from "./GameRoomCard";
// import {UserContext} from "../Contexts/UserContext";
import {GameContext} from "../Contexts/GameContext";
// var dotenv = require('dotenv').config();


class GameRoom extends Component {
  constructor(props) {
    super();
    this.state = {
      willGrow: true
    };
  }
  render() {

    return (
      <Grow in={this.state.willGrow} timeout={1000}>
      <div className="screen">

          <br />

          <Typography className="white title" variant="h2" component="h3" align="center">
            CONGRATS ON MAKING IT THIS FAR NOW PAY ATTENTION
          </Typography>
          <GameContext.Consumer>{
              (game) => ( //can rewrite this as (userProviderState) => () if that's more clear
                <div>
                   <GameRoomCard value={game}/>
                 </div>
                )
            }</GameContext.Consumer>

      </div>
      </Grow>
    );//end return
  }//end render
}//end GameRoom component

GameRoom.propTypes = {
  classes: PropTypes.object.isRequired
};

export default GameRoom;
