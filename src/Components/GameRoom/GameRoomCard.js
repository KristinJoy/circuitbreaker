import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import {GameContext} from "../Contexts/GameContext";
import CircularProgress from '@material-ui/core/CircularProgress';

/*
When a user navigates to the Game Room, it mounts this SimpleCard which makes
server calls and handles errors to be able to check against the user's boundary
to set a matching circuit in state. If no matching circuits are found, a circuit
is created and its corresponding data is set in state to the the
this.state.foundCircuit object
*/

const styles = {
  card: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  CountDown: {
    alignItems: "center"
  }
};

class SimpleCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
                  foundCircuit: '',
                  circuitFound: false,
                  message: 'Searching for hops scotches...',
                  disableSubmit: false
                  }
  }
  componentWillMount() {
    this.props.value.clearCircuitState();
    //var userId = this.props.context.userId;
    var userId = this.props.value.user._id;
    var roomName = '';
    //get a list of circuits that match a user's boundary:
    axios.post(process.env.REACT_APP_BACK_END_SERVER + 'getCircuits/', {userId: userId}).then(
      (res) => {
        var circuit = res.data;
        console.log("server returned circuit info: ", circuit);
        roomName = circuit._id;
        console.log("room name / circuit id: " + roomName);
        this.setState(
          {
          foundCircuit: circuit,
          circuitFound: true,
          message: 'Hops Scotch Found!'
        }
        );
        //DO NOT UPDATE GAME HERE, THAT IS DONE ON THE HANDLEJOIN FUNCTION
        //TODO set corresponding game circuit object through GameProvider

      }).catch( (err) => {
        console.error("error", err);
        if(userId !== ''){
          console.log("Get circuits failed, creating circuit in database");
          axios.post(process.env.REACT_APP_BACK_END_SERVER + 'addCircuit/', {userId: userId}).then(
          (res) => {
            var newCircuit = res.data;
            console.log("add circuit successful: ", newCircuit);
            this.setState(
              {
              foundCircuit: newCircuit,
              circuitFound: true,
              message: 'Hops Scotch Added!'

              }
            );
          }).catch(function(err){
            console.error(err);
          });
        }
        else {
          this.setState({
            message: 'Invalid User Id'
          });
          console.log("invalid user");
        }
      });
  }
  handleJoin(game) {
    this.setState({
      disableSubmit: true
    });
    console.log("user id: ", game.user._id);
    var req = {
      userId: game.user._id,
      circuit_id: this.state.foundCircuit._id
    }
    console.log("request body: ", req);
    //console.log("circuit object: ", this.props.value.user.current_circuit_id);
    axios.put(process.env.REACT_APP_BACK_END_SERVER + 'assignUserToCircuit/', req)
    .then(
      (res) => {
        console.log("Server has assigned user to circuit");
        game.updateGameAndSetScreen(game.user._id, 'Challenges');
        console.log("Game Provider updated, user id in GameRoomCard: ",game.user._id);
        //then route user to challenge screen

      })
      .catch(function(err){
        console.error(err);
      });
  }


  render() {
    return (
      <div className='padder'>
          <Typography variant="h6" component="h2" align="center">
            {this.state.message}
          </Typography>

            {
              this.state.foundCircuit.challenges
              ?
              <div className='padder'>
              <Typography variant="h6" align="center">Hops
              Scotch Found with  {this.state.foundCircuit.challenges.length} Squares</Typography>

              </div>
              :
              <CircularProgress/>
            }

          {this.state.circuitFound ?
            <GameContext.Consumer>{
                (game) => (
            <Button
              variant="contained"
              color="primary"
              className="animated pulse infinite center"
              disabled={this.state.disableSubmit}
              Button onClick={() => this.handleJoin(game)}>
              {this.state.disableSubmit ? <CircularProgress  size={16}/> : 'Start Drinking'}
            </Button>
        )}</GameContext.Consumer>: ''}
      </div>
    );
  }
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleCard);
