import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import axios from 'axios';
import {
  Route,
  Link,
  BrowserRouter as Router,
} from 'react-router-dom';
import Challenges from "./Challenges";
import {GameContext} from "../Contexts/GameContext";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AlertDialogSlide extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>

        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"That's A Great Picture!"}
          </DialogTitle>
          <DialogContent className="center">
            <DialogContentText id="alert-dialog-slide-description">
              Picture and Location Confirmed!
              Well Played!
              Keep it Going!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => game.setView('Challenges')} color="primary">
              Back to Challenges
            </Button>

          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AlertDialogSlide;
