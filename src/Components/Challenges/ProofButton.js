import React from 'react';
import Button from "@material-ui/core/Button";
import {GameContext} from "../Contexts/GameContext";
import GameRoom from '../GameRoom/GameRoom';
import Camera from '../Camera/Camera';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  justifyContent: 'center',
});

class ProofButton extends React.Component {
  constructor(props) {
    super(props);
    //this.handleClick.bind(this);
  }

  componentWillMount(){
  }
  handleClick() {
    console.log("proof button clicked");
   console.log("Proof button this prop value at click", this.props.value);
  }

  render(){
    return (
      <div>
        <GameContext.Consumer>{
            (game) => (
        <Button variant="contained"
          size="small" justify="center"
          alignItems="flex-center"
          color="primary"
          className="animated pulse infinite center"
          disabled={this.props.isWithinDistance}

          onClick={() => {
            game.setCurrentChallenge(this.props.value, this.props.order);
            game.setView('Camera');
          }}
          >
          Take Picture
        </Button>
    )}</GameContext.Consumer>

      </div>
    );
  }
}

export default ProofButton;
