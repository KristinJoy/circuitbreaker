import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ProofButton from './ProofButton';
import TextField from '@material-ui/core/TextField';
import {GameContext} from "../Contexts/GameContext";
import Button from "@material-ui/core/Button";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Message from '@material-ui/icons/Message';

import io from 'socket.io-client';

import * as Scroll from 'react-scroll';
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

/*
https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
https://www.npmjs.com/package/react-scroll
https://stackoverflow.com/questions/45719909/scroll-to-bottom-of-an-overflowing-div-in-react
https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
*/


class Chat extends React.Component{
  constructor(props) {
    super(props);
    this.onFormChange = (e) => {
        this.props.chat.onFormChange(e.target.value);

    }
  }
  componentWillMount() {
    console.log("Chat Room Mounted, room #", this.props.value.circuit._id);
    this.props.chat.resetBadge();
  }

  scrollToBottom() {
    animateScroll.scrollToBottom({
      containerId: "options-holder"
    });
  }

  render(){
    let user = this.props.value.user;
    let circuit = this.props.value.circuit;

  return (
    <div className="chat-window white">

      <Typography variant="h4">
        <strong>{user.username}</strong>{`'`}s Chat
      </Typography>

      <div className="chat-messages white" id="messages-container">

        {(this.props.chat.state.messages.length > 0) ? '' : <li>No Messages</li>}

        {this.props.chat.state.messages.scrollToBottom(function(message, i){
          return (<ListItem key={i}>
                      <ListItemIcon>
                        <Message color="primary"/>
                      </ListItemIcon>
                      <ListItemText>
                        <strong>{message.username}</strong>: {message.message}
                        </ListItemText>
                    </ListItem>)
       })}
       </div>


      <form onSubmit={this.props.chat.sendMessage} noValidate autoComplete="off">
        <TextField
          id="outlined-name"
          label="Message"
          value={this.props.chat.state.message}
          onChange={this.onFormChange}
          margin="normal"
          variant="outlined"
          fullWidth
          className="white"
        /><br/>
      <Button variant="contained" size="medium" justify="center"
          color="primary" type="submit">Send</Button>
      </form>
    </div>
    );
  }
}


export default Chat;
