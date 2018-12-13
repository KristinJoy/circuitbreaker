import React from "react";
import { BrowserRouter as  Link } from "react-router-dom";
//import CountDown from "../Utilities/CountDown";
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
import LinearProgress from '@material-ui/core/LinearProgress';

/*

When a user navigates to the Game Room, it mounts this SimpleCard which makes server calls and handles errors to be able to check against the user's boundary to set a matching circuit in state. If no matching circuits are found, a circuit is created and its corresponding data is set in state to the the this.state.foundCircuit object

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
    super();
    this.state = {
                  foundCircuit: '',
                  circuitFound: false,
                  message: 'Searching for circuits...'
                  }
  }
  componentWillMount() {
    //var userId = this.props.context.userId;
    var userId = this.props.value.user._id;
    var roomName = '';
    //get a list of circuits that match a user's boundary:
    axios.post(process.env.REACT_APP_BACK_END_SERVER + 'getCircuits/', {_id: userId}).then(
      (res) => {
        var circuit = res.data;
        console.log("server returned circuit info: ", circuit);
        console.log("first challenge: ", circuit.challenges[0]);
        roomName = circuit._id;
        console.log("room name / circuit id: " + roomName);
        console.log("this value inside post call ", this.props.value);
        this.setState(
          {
          foundCircuit: circuit,
          circuitFound: true,
          message: 'Circuit Found!'
        }
        );
        //DO NOT UPDATE GAME HERE, THAT IS DONE ON THE HANDLEJOIN FUNCTION
        //TODO set corresponding game circuit object through GameProvider

      }).catch( (err) => {
        console.error("error", err);
        if(userId != ''){
          console.log("Get circuits failed, creating circuit in database");
          axios.post(process.env.REACT_APP_BACK_END_SERVER + 'addCircuit/', {_id: userId}).then(
          (res) => {
            var newCircuit = res.data;
            console.log("add circuit successful: ", newCircuit);
            this.setState(
              {
              foundCircuit: newCircuit,
              circuitFound: true,
              message: 'Circuit Added!'

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
    console.log("user id: ", game.user._id);
    var req = {
      userId: game.user._id,
      circuit_id: this.state.foundCircuit._id
    }
    console.log("request body: ", req);
    //console.log("circuit object: ", this.props.value.user.current_circuit_id);
    axios.put(process.env.REACT_APP_BACK_END_SERVER + 'assignUserToCircuit/', req).then(
      (res) => {
        var circuit = res.data;
        console.log("server returned circuit info: ", circuit);
        console.log("Server has assigned user to circuit");
        game.updateGame(game.user._id);
        //TODO set corresponding game circuit object through GameProvider
      }).catch(function(err){
        console.error(err);
        //add circuit if can't find: (NOT WORKING CURRENTLY)

      });

  }


  render() {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" align="center">
            {this.state.message}
          </Typography>
          <Typography variant="h6" component="h2" align="center">
            {
              this.state.foundCircuit.challenges
              ?
              "Circuit Found with " + this.state.foundCircuit.challenges.length +
              " Challenges"
              :
              <div>
                <CircularProgress/>
                <LinearProgress/>
              </div>

            }
          </Typography>
        </CardContent>
        <CardActions>
          {this.state.circuitFound ?
            <GameContext.Consumer>{
                (game) => (
            <Button size="small" justify="center"
              color="primary"
              onClick={() => this.handleJoin(game)}
              >
              Join Circuit
            </Button>
        )}</GameContext.Consumer>: ''}
        </CardActions>
      </Card>
    );
  }
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleCard);
