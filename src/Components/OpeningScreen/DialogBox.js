import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from "@material-ui/core/styles";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {UserContext} from "../Contexts/UserContext";

import axios from "axios";
import {Route, Link, BrowserRouter as Router} from 'react-router-dom';
import GameRoom from "../GameRoom/GameRoom";
var dotenv = require('dotenv').config();
const BACK_END_SERVER = 'http://localhost:3001/';

export default class FormDialog extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open: false,
      userNameInputValue: '',
      idSearch: '',
      _id: ''
    };
  }
  // getUserLocation = () => {
  //
  // }
  componentWillMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({location:position})

        console.log(this.state.location);
      });
    } else {
      console.error("Browser does not support Geolocation");
    }
  }
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };
  updateUserNameInputValue = (e) => {
    this.setState({
            userNameInputValue: e.target.value
        });
  }
  updateIdSearchValue = (e) => {
    this.setState({
            idSearch: e.target.value
        });
  }
  submitUserToServer = () => {
    console.log("add user accessed for " + this.state.userNameInputValue);
    var userObject = {
      username: this.state.userNameInputValue,
      longitude: this.state.location.coords.longitude,
      latitude: this.state.location.coords.latitude
    };
    // userObject.username = ;
    // userObject.longitude = this.state.location.coords.longitude;
    // userObject.latitude = this.state.location.coords.latitude;
    const addUser = process.env.REACT_APP_BACK_END_SERVER + 'addUser';
    var userId = '';
    //must use fat arrow function in callback to bind FormDialog's this
    //to inside the function itself:
    axios.post(addUser, userObject).then((res, err) => {
      if(err) {console.error(err);}
        console.log("passed value prop: ", this.props.value);
        console.log("Add user server response:");
        console.log(res.data);
        this.props.value.updateUser(res.data);
        userId = res.data;
    }).then(() => {
      //TODO set user id state here and pass up to toppest parent
      this.setState({
        _id : userId
      });
      console.log("this is the user id in state: " + this.state._id);
    });
  }

  render() {
    var userId = "5c0f6b4fc2f3025f3a8aa33a";
    return (
      <div>
        <TextField
          value={this.state.idSearch}
          onChange={this.updateIdSearchValue}
          margin="dense"
          id="name"
          label="Name"
          fullWidth
        />
        <UserContext.Consumer>{
            (game) => ( //can rewrite this as (userProviderState) => () if that's more clear
              <div>
                <Button
                  variant="contained" color="secondary"
                  Button onClick={() => {
                    game.updateUser(this.state.idSearch) /*fill in this value with session._id somehow*/
                  }}>
                  Update User Id
                </Button>
              </div>
            )
          }</UserContext.Consumer>
      <Button variant="contained" color="primary"
        Button onClick={this.handleClickOpen}>
        Add User to Database
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Who Are You</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please give us a user name!
            </DialogContentText>
            <TextField
              value={this.state.userNameInputValue}
              onChange={this.updateUserNameInputValue}
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            {/*<Link to="/GameRoom">*/}
            <Button
              color="primary"
              onClick={() => {
                this.handleClose()
                this.submitUserToServer()
                }}>
              Submit
            </Button>
          {/*</Link>*/}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
