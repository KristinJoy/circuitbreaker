import React from "react";
import { BrowserRouter as  Link } from "react-router-dom";
import CountDown from "../Utilities/CountDown";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import {GameContext} from "../Contexts/GameContext";




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
    this.state = {foundCircuit: ''}
  }
  componentWillMount() {
    //var userId = this.props.context.userId;
    var userId = this.props.value.user._id;
    var roomName = '';
    console.log("props at component will mount: ", this.props);
    //get a list of circuits that match a user's boundary:
    axios.post(process.env.REACT_APP_BACK_END_SERVER + 'getCircuits/', {_id: userId}).then(
      (res) => {
        var circuit = res.data;
        console.log("server returned circuit info: ", circuit);
        console.log("first challenge: ", circuit.challenges[0]);
        roomName = circuit._id;
        console.log("room name / circuit id: " + roomName);
        console.log("this value inside post call ", this.props.value);
        this.setState({foundCircuit: circuit});
        //DO NOT UPDATE GAME HERE, THAT IS DONE ON THE HANDLEJOIN FUNCTION
        //TODO set corresponding game circuit object through GameProvider

      }).catch( (err) => {
        console.error("error", err);
        if(userId != ''){
          console.log("User is not empty");
          axios.post(process.env.REACT_APP_BACK_END_SERVER + 'addCircuit/', {_id: userId}).then(
          (res) => {
            var newCircuit = res.data;
            console.log("add circuit successful: ", newCircuit);
            this.setState({foundCircuit: newCircuit});
          }).catch(function(err){
            console.error(err);
          });
        }
        else {
          console.log("invalid user");
        }
      });
  }
  handleJoin(game) {
    console.log("user object: ", game.user);
    //console.log("circuit object: ", this.props.value.user.current_circuit_id);
    /*axios.put(process.env.REACT_APP_BACK_END_SERVER + 'assignUserToCircuit/', {_id: this.props.value.user}).then(
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
        //}
      });*/
  }


  render() {
    return (
      <Card>
        <CardContent>
          <Typography color="textSecondary" gutterBottom align="center">
            Location
          </Typography>
          <Typography variant="h6" component="h2" align="center">
            {this.state.foundCircuit.challenges ?
              this.state.foundCircuit.challenges[1].full_challenge_text
              : ''}
          </Typography>
        </CardContent>
        <CardActions>
            <GameContext.Consumer>{
                (game) => (
            <Button size="small" justify="center"
              onClick={() => this.handleJoin(game)}
              >
              Join Circuit
            </Button>
          )}</GameContext.Consumer>
        </CardActions>
      </Card>
    );
  }
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleCard);
