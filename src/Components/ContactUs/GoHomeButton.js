import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
});



class ButtonSizes extends React.Component {
  constructor () {
    super();
    this.state = {
      disableSubmit: false
    }
  }
  componentWillMount() {
    //console.log(this.props.value);
  }
  handleClick = () => {
    this.setState({
      disableSubmit: true
    })
    //clear current user circuit
    //delete circuit
    //change to screen
    //when Gameroom mounts, the user is updated and their game state is cleared
    //so keep this as setScreen...
    this.props.value.setScreen('OpeningScreen');
  }
  render(){
  return (
    <div>
      <div>
          <Button onClick={this.handleClick} size="small" color="primary">
           Go To Home Page
          </Button>
      </div>
    </div>
  );
  }
}

ButtonSizes.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonSizes);
