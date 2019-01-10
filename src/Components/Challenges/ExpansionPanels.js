import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
// import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ProofButton from './ProofButton';
// import {GameContext} from "../Contexts/GameContext";


const styles = theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  button: {
    justifyContent: 'center',

  },
});

class SimpleExpansionPanel extends React.Component{
  constructor(props) {
    super(props);
    this.state = ({
      isWithinDistance: false,
      disabled: false,
      classWhite: '',
      dark: ''
    })
  }

  componentWillMount() {
    this.props.updateDistance();
    if((this.props.distance-1000) < 2) {
      this.setState({
        isWithinDistance: true
      });
    }
    console.log("Id users completed", this.props.value.id_users_completed);
    console.log("Checking against user Id", this.props.userId);

  if (this.props.value.id_users_completed.includes(this.props.userId)){
    this.setState(
      {
        disabled : true,
        classWhite: 'white'
      }
    );
    }
  }

  render(){
    let challenge = this.props.value;
  return (
      <ExpansionPanel disabled={this.state.disabled} className="white">
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className="white center" variant="h6">
            {
              (this.props.listId+1) + ") " + this.props.value.full_challenge_text
            }
          </Typography>
          <Typography className='distance-badge center'>
            <strong>{(this.props.distance).toFixed(2)}</strong> miles away
          </Typography>
        </ExpansionPanelSummary>
        <div class="center padder challenge-description">
        <Typography variant="h3">
          {
          challenge.location_gate.name
          }
        </Typography>
        <div className="padder">
       <ProofButton value={this.props.value} order={this.props.order}  />
       </div>
        <Typography >{
          this.props.value.location_gate.address.replace(/<br\s*\/?>/gi, '. ')
          }</Typography>

        <Typography className='padder'>
          <strong>{this.props.value.id_users_completed.length-1}</strong> users have hopped this square

        </Typography>
        <Typography >
          {
            (this.props.distance < 15) ? 'You can take a selfie!' : 'You can take a picture, but it wont count'
          }
        </Typography>
      </div>
      </ExpansionPanel>
    );
  }
}

SimpleExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleExpansionPanel);
