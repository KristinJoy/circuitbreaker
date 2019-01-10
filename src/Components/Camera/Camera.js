import React, { Component } from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import {GameContext} from "../Contexts/GameContext";
import Dialog from '@material-ui/core/Dialog';
import Grow from '@material-ui/core/Grow';
import Grid from "@material-ui/core/Grid";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import CircularProgress from '@material-ui/core/CircularProgress';
require('dotenv').config();


function Transition(props) {
  return <Slide direction="up" {...props} />;
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      screenshotTaken: false,
      screenshot: null,
      tab: 0,
      challengeCompleteOpen: false,
      challengeRejectedOpen: false,
      disableSubmit: false,
      userWonCircuit: false,
      willGrow: true,
      message: ''
    };
    this.confirmPhoto.bind(this)
  }

  componentDidMount() {
    console.log("Getting user location");
    if (navigator.geolocation) {
      console.log("Navigator has geolocation");
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("position and all that: ", position);
        this.setState({
          location:position,
          disableSubmit: false
        });

        console.log(this.state.location);
      },
    (err) => {
      console.log("error", err);
    }, {enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0});
    } else {
      console.error("Browser does not support Geolocation");
    }
    //put this.props.socket.sendWin() in axios put for win
  }
  componentWillUnmount() {
    this.props.value.setView('');
  }

  handleClick = () => {
    const screenshot = this.webcam.getScreenshot()
    this.setState({
      screenshot: screenshot,
      screenshotTaken: true
    });

  }

  handleClose = () => {
    this.setState({
      challengeRejectedOpen: false
    });
    this.resetCamera();
  }
  handleDialogue = () => {
    this.props.value.setScreen('CircuitReview');
  }

  resetCamera = () => {
    this.setState({
      screenshotTaken: false,
      screenshot: null
    });
  }

  confirmPhoto = () => {
    this.setState({
      disableSubmit: true
    });
    // console.log("data: ", req);
    console.log("current challenge index: ", this.props.value.currentChallengeIndex);
    let req = {
      screenshot: this.state.screenshot,
      check_word: this.props.value.currentChallenge.object_gate,
      location_to_check: this.props.value.currentChallenge.location_gate.position,
      userId: this.props.value.user._id,
      circuitId: this.props.value.circuit._id,
      challengeIndex: this.props.value.currentChallengeIndex,
      user_position: [this.state.location.coords.latitude, this.state.location.coords.longitude]
    };
    // console.log("data to server: ", req);
    console.log("the challenge ID in question: ", this.props.value.currentChallenge._id)
    axios.put(process.env.REACT_APP_BACK_END_SERVER + 'submitChallenge', req)
    .then((res)=>{
      console.log(res);
      //only one dialogue, no need to set message
      if(res.data.circuitComplete){
        console.log("circuit complete!");
        //socket event disconnect all`
        this.props.socket.circuitComplete(this.state.screenshot);
        this.setState({
          userWonCircuit: true //opens a dialogue box directing user to next screen
        });
      }
      //also only one dialogue, no need to set message
      else if(res.data.challengeComplete){
        //socket event update all (RECEIVE_WIN)
        console.log("challenge complete!");
          this.setState({
          challengeCompleteOpen: true,
          message: 'Nice job! We detected ' + this.props.value.currentChallenge.object_gate + ' in your picture, and you were within range of ' + this.props.value.currentChallenge.location_gate.name + '!'
        });
        this.props.socket.sendWin();
      }
      //custom error messages in the challengeRejectedOpen dialogue
      else {
        if (res.data.objectGate){
          this.setState({
            challengeRejectedOpen: true,
            message: 'We detected ' + this.props.value.currentChallenge.object_gate + ' in your picture, but your are not close enough!',
            disableSubmit: false
          });
        }
        else if (res.data.locationGate){
          this.setState({
            challengeRejectedOpen: true,
            message: 'You are close enough, but we could not detect ' + this.props.value.currentChallenge.object_gate + ' in your picture.',
            disableSubmit: false
          });
        }
        else{
          this.setState({
            challengeRejectedOpen: true,
            message: 'You are not close enough and we could not detect ' + this.props.value.currentChallenge.object_gate + ' in your picture.',
            disableSubmit: false
          });
        }
      }
    })
    .catch((err)=>{
      console.log(err);
    });
    // console.log(this);
  }

  render() {
    const videoConstraints = {
      facingMode: "user"
    };
    let currentChallenge = this.props.value.currentChallenge;
    if(this.state.screenshotTaken){
      return(
        <div class="center">
          <Typography className="white">
            <h2>
          {this.props.value.currentChallenge.full_challenge_text}
          </h2>
        </Typography>
        {this.state.screenshot ?
        <img

        height={300}
        src={this.state.screenshot} alt='' /> : null}

          <div>

              <Dialog
                open={this.state.userWonCircuit}
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
              >

                    <DialogTitle id="alert-dialog-slide-title">
                        {"Congrats! You finished the hops scotch first!"}
                    </DialogTitle>

                    <DialogContent>

                        <DialogContentText id="alert-dialog-slide-description">

                          Now give me your keys, you sloshed sack of shite!

                        </DialogContentText>

                        <div class="center image-wrapper">
                          <img src={this.state.screenshot} alt='' />
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
                          Review Squares
                        </Button>
                      </DialogActions>

              </Dialog>

              <div class="center">

                    <Button
                      className="animated pulse infinite center"
                      justify="center"
                      variant="contained"
                      size="small"
                      color="secondary"
                      disabled={this.state.disableSubmit}
                      onClick={this.confirmPhoto}
                      >
                      {this.state.disableSubmit ? <CircularProgress  size={16}/> : 'Submit'}
                    </Button>

                    <Button
                     justify="center"
                      variant="contained"
                      size="small"
                      onClick={this.resetCamera}>
                      Retake
                    </Button>

              </div>

          </div>

          <GameContext.Consumer>{
            (game) => (
              <div class='center'>
              <Button
                justify="center"
                variant="contained"
                size="small"
                justify="center"
                color="primary"
                onClick={() => game.setView('')}>
                Back to Squares
              </Button>
              </div>
          )}</GameContext.Consumer>
        <Dialog
          open={this.state.challengeCompleteOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"That's A Great Picture!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {this.state.message}
            </DialogContentText>
          </DialogContent>
          <GameContext.Consumer>{
            (game) => (
          <DialogActions>
            <Button onClick={() => game.updateGameAndSetView(game.user._id, 'Challenges')} color="primary">
              Back to Squares
            </Button>
          </DialogActions>
        )}</GameContext.Consumer>
        </Dialog>
        <Dialog
          open={this.state.challengeRejectedOpen}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"We May Have Missed Something!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {this.state.message}
            </DialogContentText>
          </DialogContent>
          <GameContext.Consumer>{
            (game) => (
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Try Again
            </Button>
            <Button onClick={() => game.setView('Challenges')} color="primary">
              Back to Challenges
            </Button>

          </DialogActions>
          )}</GameContext.Consumer>
        </Dialog>
      </div>

      );
    }
    else{
      return (
        <Grow in={this.state.willGrow} timeout={1000}>

        <div class="center">
        <Typography className="white">
          <h2>
        {this.props.value.currentChallenge.full_challenge_text}
        </h2>
      </Typography>
          <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            ref={node => this.webcam = node}
            screenshotQuality={.8}
            width={375}
            height={300}
            videoConstraints={videoConstraints}
          />

        <div class="center padder">
            <Button
              className="animated pulse infinite center"
              variant="contained"
              size="small"
              color="secondary"
              onClick={this.handleClick}>
              Capture
            </Button>
          </div>
          <GameContext.Consumer>{
            (game) => (
              <div class="center">
              <Button
                variant="contained"
                size="small"
                justify="center"
                color="primary"
                onClick={() => game.setView('')}>
                Back to Challenges
              </Button>
              </div>
          )}</GameContext.Consumer>
        </div>
        </Grow>

      );
    }//closes else
  }
}


/*
ORIGINAL CAMERA.JS CODE WITH OLD NPM

export default class App extends Component {

  constructor(props) {
    super(props);
    this.takePicture = this.takePicture.bind(this);
    this.state = {blob:''};
    this.confirmphoto.bind(this)
  }

  takePicture() {
    this.camera.capture()
    .then(blob => {
      this.img.src = URL.createObjectURL(blob)
      this.img.onload = () => {
        URL.revokeObjectURL(this.src)
      }
      this.setState({
        blob:blob
      })
    })
  }

  confirmphoto() {
    console.log("blob contents:", this.state.blob);
    axios.post(process.env.REACT_APP_BACK_END_SERVER + 'submitChallenge', this.state.blob)
    .then((res)=>{
      console.log(res);
    })
    .catch((err)=>{
      console.log(err);
    });//end axios call
  }

  render() {
    return (
      <div style={style.container}>

        <Camera
          style={style.preview}
          ref={(cam) => {
            this.camera = cam;
          }}
        >

          <div style={style.captureContainer} onClick={this.takePicture}>
            <div style={style.captureButton} />
          </div>
        </Camera>

        <img
          style={style.captureImage}
          ref={(img) => {
            this.img = img;
          }}
        />

        <CameraButtons confirmphoto={
              this.confirmphoto.bind(this)}/>

      </div>
    );
  }
}

*/


/*
STYLE TO UNLOAD LATER

const style = {
  preview: {
    position: 'relative',
  },
  captureContainer: {
    display: 'flex',
    position: 'absolute',
    justifyContent: 'center',
    zIndex: 1,
    bottom: 0,
    width: '100%'
  },
  captureButton: {
    backgroundColor: '#fff',
    borderRadius: '50%',
    height: 56,
    width: 56,
    color: '#000',
    margin: 20
  },
  captureImage: {
    width: '100%'
  }
};

*/
