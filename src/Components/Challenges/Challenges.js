import React from 'react';
import PropTypes from 'prop-types';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ExpansionPanels from "./ExpansionPanels";
import Chat from "./Chat";
import MapContainer from "../Map/MapContainer";
import {GameContext} from "../Contexts/GameContext";
import CircularProgress from '@material-ui/core/CircularProgress';
import io from 'socket.io-client';
import Camera from "../Camera/Camera";
import Grid from "@material-ui/core/Grid";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Webcam from 'react-webcam';
const haversine = require('haversine');
function Transition(props) {
  return <Slide direction="up" {...props} />;
}


function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};
const styles = theme => ({
  margin: {
    margin: theme.spacing.unit * 2,
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`,
  },
});

class Challenges extends React.Component {
  constructor(props) {
    super();
    this.socket = io(process.env.REACT_APP_BACK_END_SERVER);
    this.updateCurrentUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.setState({location:position})
          let positions = [];
          let challenges = this.props.value.circuit.challenges;
          for (var i = 0; i < challenges.length; i++) {
            positions.push(challenges[i].location_gate.position);
          }

            let challengeOrder = this.calcHaversine(positions, this.state.location.coords);
            this.setState({
              challengeOrder: challengeOrder
            });
          });
      } else {
        console.error("Browser does not support Geolocation");
      }
    };

/*---------------------------------chat stuff-------------------------------------------------*/
const addMessage = data => {
  this.setState({
    messages: [...this.state.messages, data]
  });
};
this.resetBadge = () => {
  this.setState({
    unreadMessages: 0
  });
}
this.sendMessage = (e) => {
  console.log("sending message to server");
  e.preventDefault();
  if(this.state.message === ''){
    return;
  }
  this.socket.emit('SEND', {
    room: this.props.value.circuit._id,
    username: this.state.username,
    message: this.state.message
  });
  this.setState({
    message: ''
  });
};
this.onFormChange = (e) => {
        this.setState({
          message: e
        })
    };
      /*--------------------------------socket win events---------------------------------*/
      this.socket.on('RECEIVE', data => {
        var unread = this.state.unreadMessages;
        addMessage(data);
        if (data.username === this.state.username){
          return;
        }
        if(this.state.value !== 'chat'){
          unread++;
        }
        this.setState({
          messageSnackBarOpen: true,
          unreadMessages: unread
        });
      });//closes RECEIVE function
      this.socket.on('RECEIVE_WIN', data => {
        var unread = this.state.unreadMessages;
        addMessage(data);
        if(this.state.value !== 'chat'){
          unread++;
        }
        console.log("updating game after receiving win");
        this.props.value.updateGame(this.props.value.user._id);
        this.setState({
          messageSnackBarOpen: true,
          unreadMessages: unread
        });
      });//closes RECEIVE_WIN function
    this.sendWin = () => {
      console.log("sending win to server");
      this.socket.emit('CHALLENGE_COMPLETE', {
        room: this.props.value.circuit._id,
        username: this.state.username
      });

    }


/*-----------------------------------------------------------circuit complete-------------------------------------------*/
    this.circuitComplete = (image) => {
      this.socket.emit('CIRCUIT_COMPLETE', {
        room: this.props.value.circuit._id,
        image: image
      });
      this.setState({
        userWonCircuit: true
      });
      this.props.value.updateGame(this.props.value.user._id);
    }

    this.socket.on('RECEIVE_CIRCUIT_COMPLETE', data => {
      this.setState({
        userLostCircuit: true,
        winningImage: data.image
      });
      this.props.value.updateGame(this.props.value.user._id);
    });//closes RECEIVE_WIN function

  /*----------------------------------------------------final state declaration----------------------------------*/
    this.state = {
      messageSnackBarOpen: false,
      //chat stuff:
      username: 'Username not set',
      message: '',
      messages: [],//sets it so that when screen opens, challenges tab has focus
      unreadMessages: 0,
      value: 'challenges',//sets it so that when screen opens, challenges tab has focus
      location: {
        coords: []
      },
      updateCurrentUserLocation: this.updateCurrentUserLocation,
      userLostCircuit: false
    }
  }


  /*-------------------------------this function returns position with [0] being the closest and [9] being the furthest--------------------------*/
  calcHaversine = (positions, userLocation) => {
      let distanceArray = [];
      let distanceOrder = [];
      console.log("haversine args: positions: ", positions);
      console.log("haversine args: user location: ", userLocation);
      for (var i=0; i < positions.length; i++) {
        let location = {
          latitude: positions[i][0],
          longitude: positions[i][1]
        }
        let user_location = {
          longitude: userLocation.longitude,
          latitude: userLocation.latitude
        }
        distanceArray.push(haversine(location, user_location));
      }//distance Array now contains haversine distance between location and user
      this.setState({
        distanceArray: distanceArray
      });


      for(var j = 0; j < distanceArray.length; j++){
        let low = 100;
        let indexOfLow;
        for (var i = 0; i < distanceArray.length; i++){
          if(distanceArray[i] < low) {
            low = distanceArray[i];
            indexOfLow = i;
          }
        }
        distanceOrder.push(indexOfLow);
        distanceArray[indexOfLow] += 1000; //make it so new low is found...
      }

      console.log("Order of challenges after haversine: ", distanceOrder);
      return distanceOrder;
  }
  /*---------------------------this function gets user location and calls the haversine
  function above to set in state a new order to display the challenges-----------*/
  orderChallengesByDistance = () => {
    this.setState({
      challengeOrder: false
    })
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({location:position})
        console.log(this.state.location);
        let positions = [];
        let challenges = this.props.value.circuit.challenges;
        for (var i = 0; i < challenges.length; i++) {
          positions.push(challenges[i].location_gate.position);
        }

          let challengeOrder = this.calcHaversine(positions, this.state.location.coords);
          this.setState({
            challengeOrder: challengeOrder
          })
          // console.log("challengeOrder returned from Haversine calc: ", challengeOrder);
      },
      (err) => {console.log("error", err);},
      {//options
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    } else {
      console.error("Browser does not support Geolocation");
    }
  }
/*-----------------------------------------utility functions---------------------------------------*/
  closeSnackBar = (event, reason) => {
    this.setState({ messageSnackBarOpen: false });
  };
  handleDialogue = () => {
    this.props.value.setScreen('CircuitReview');
  }


  /*-----------------------------------------lifecycle functions---------------------------------------*/
  componentWillMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({location:position})

        console.log(this.state.location);
        let positions = [];
        let challenges = this.props.value.circuit.challenges;
        for (var i = 0; i < challenges.length; i++) {
          positions.push(challenges[i].location_gate.position);
        }

          let challengeOrder = this.calcHaversine(positions, this.state.location.coords);
          this.setState({
            challengeOrder: challengeOrder
          })
          console.log("challengeOrder returned from Haversine calc: ", challengeOrder);
      });
    } else {
      console.error("Browser does not support Geolocation");
    }
    this.setState({
      username: this.props.value.user.username
    });
    //this.orderChallengesByDistance();
  }
  componentDidMount() {
    //join the room via the socket instance living in Challenge's state
    //that means the socket (or methods that affect it) can be passed through props
    //to the chat room tab
    this.socket.emit('joinRoom', this.props.value.circuit._id, this.state.username);
  }
  componentWillUnmount() {
    //terminate the socket once the user leaves the challenge screen
    this.socket.disconnect();
  }

  /*--------------------------------------tab switching stuff-------------------------------*/
  changeTab = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };




  render() {
    const { classes, theme } = styles;
    const { value } = this.state;

    if (this.props.value.view === 'Camera'){
      return (
        <div>
          <GameContext.Consumer>{
            (game) => (
              <Camera value={game} socket={this}/>
            )}
          </GameContext.Consumer>

        </div>
      );
    }
    else {
      return (
          <div>
            <Dialog
              open={this.state.userLostCircuit}
              TransitionComponent={Transition}
              keepMounted
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="alert-dialog-slide-title">
                {"Sorry! You Were Too Slow!"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  Sorry you did not break the circuit! Better luck next time! Here's a quick look at the winning picture:
                </DialogContentText>
                <div class="center image-wrapper">
                  <img src={this.state.winningImage} alt='' />
                    <div class="overlay">
                      <div class="overlay-text">
                        <Typography variant="h4" className="white">
                          Winner!
                      </Typography>
                      </div>
                    </div>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleDialogue} color="primary">
                  Review Circuit
                </Button>
              </DialogActions>
            </Dialog>

            <AppBar position="static" color="default">
              <Tabs
                value={this.state.value}
                onChange={this.changeTab}
                indicatorColor="primary"
                textColor="primary"
                fullWidth
              >
                <Tab value="challenges" label="SQUARES" />
                <Tab value="map" label="MAP" />
                {(this.state.unreadMessages > 0) ?
                <Tab value="chat" label={
                    <Badge className="chat-badge" color="secondary" badgeContent={this.state.unreadMessages}>
                      CHAT
                    </Badge>}/> :
                <Tab value="chat" label="CHAT" />}
              </Tabs>
            </AppBar>



            {value === 'challenges' &&
              <div>
                <Grid item xs={12}>
                  <Typography variant="h4" className="white center padder">
                  {this.state.username}
                  </Typography>
                </Grid>
            <div className="center">
              <Typography className="center white" variant="h4">
                Squares
              </Typography>
              <div className="padder">
            <Button variant="contained"
              size="small" justify="center"
              color="primary"

              onClick={this.orderChallengesByDistance}>Refresh Squares</Button>
            </div>
            </div>
            <div className="expansion-panels">
              {this.state.challengeOrder
                ?
                this.state.challengeOrder.map((challenge, i) => {
                  return <ExpansionPanels value={this.props.value.circuit.challenges[challenge]}
                            userId={this.props.value.user._id}
                            distance={this.state.distanceArray[challenge]-1000}
                            updateDistance={this.state.updateCurrentUserLocation}
                            key={i} listId={i} order={challenge}
                            />
                        })
                    :
                    <div className="center padder">
                      <CircularProgress className="white"/>
                    </div>}
              </div>
              {/*<GameContext.Consumer>{
                  (game) => (
                    game.circuit.challenges.map(function(challenge, i){
                      return <ExpansionPanels value={challenge} key={i} listId={i} />
                    })
              )}</GameContext.Consumer>*/}

              </div>
            }

            {value === 'map' && <Map/>}

            {value === 'chat' &&
              <div><Grid item xs={12}>
                <Typography variant="h4" className="white center padder">
                {this.state.username}
                </Typography>
              </Grid>
                <GameContext.Consumer>{
                    (game) => (
                <Chat chat={this} value={game}/>
                )}</GameContext.Consumer></div>
            }

            {(this.state.messages.length > 0) ?
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.messageSnackBarOpen}
          autoHideDuration={2000}
          onClose={this.closeSnackBar}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={
          <span id="message-id"><strong>{this.state.messages[this.state.messages.length-1].username}</strong>:   {this.state.messages[this.state.messages.length-1].message}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.closeSnackBar}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />: ''}

        <Dialog
          open={this.state.userLostCircuit}
          TransitionComponent={Transition}
          keepMounted
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Sorry! You Were Too Slow!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Sorry you couldn't hop quickly enough! Better luck next time!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDialogue} color="primary">
              Review Squares
            </Button>
          </DialogActions>
        </Dialog>


          </div>
      );
    }
  }
}


function Map(theme) {
  return (
      <div>
        <GameContext.Consumer>{
            (game) => (
        <MapContainer value={game}/>
        )}</GameContext.Consumer>
      </div>
  );
}
function ChatF(props) {
  return (

      <div className="screen">
        <GameContext.Consumer>{
            (game) => (
        <Chat chat={props.chat} value={game}/>
        )}</GameContext.Consumer>
      </div>

  );
}

export default Challenges;
