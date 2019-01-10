import React from "react";
import Grow from '@material-ui/core/Grow';
import GameRoom from "./GameRoom/GameRoom";
import ChallengesWrapper from "./Challenges/ChallengesWrapper";
// import Challenges from "./Challenges/Challenges";
// import Map from "./Map/Map";
import Camera from "./Camera/Camera";
import CircuitReview from "./CircuitReview/CircuitReview";
import OpeningScreen from "./OpeningScreen/OpeningScreen";
import MainAppBar from "./Utilities/MainAppBar";
import NoPage from "./Utilities/NoPage";
// import GameProvider from "./Contexts/GameContext";
// import {GameContext} from "./Contexts/GameContext";
import {createMuiTheme} from '@material-ui/core/styles';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import Background from './Images/circuit4.jpg';
import {GameContext} from "./Contexts/GameContext";

const theme = createMuiTheme({
  palette: {
    primary: {
    //  main: '#448AFF',
      main: '#FEBD34',
      contrastText: '#eeeeee',
    },
    secondary: {
      main: '#f28e1c',
      contrastText: '#eeeeee',
    }
    // secondary1: {
    //   main: '#C62828',
    //   contrastText: '#eeeeee',
    // },
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: this.props.value.screen,
      willGrow: true
    }
  }

  componentDidMount(){
    //document.body.style.backgroundImage = `url(${Background})`;

  }

  render() {
    if (this.props.value.screen === 'OpeningScreen') {
      return (
        <div>
          <MuiThemeProvider theme={theme}>
            <MainAppBar/>
            <OpeningScreen/>
          </MuiThemeProvider>
        </div>
      );
    }
    else if (this.props.value.screen === 'GameRoom'){
      return (
        <div>
          <MuiThemeProvider theme={theme}>
            <MainAppBar/>
            <GameRoom/>
          </MuiThemeProvider>
        </div>

      );
    }
    else if (this.props.value.screen === 'Challenges'){
      return (
        <div Grow in={this.state.willGrow} timeout={1000}>
          <MuiThemeProvider theme={theme}>
            <MainAppBar/>
            <ChallengesWrapper/>
          </MuiThemeProvider>
        </div>
      );
    }
    else if (this.props.value.screen === 'Camera'){
      return (

        <div>
          <MuiThemeProvider theme={theme}>
            <MainAppBar/>
            <Camera/>
          </MuiThemeProvider>
        </div>

      );
    }
    else if (this.props.value.screen === 'CircuitReview'){
      return (
        <div>
          <MuiThemeProvider theme={theme}>
            <MainAppBar/>
              <GameContext.Consumer>{
                  (game) => (<CircuitReview value={game}/>)
          }</GameContext.Consumer>
          </MuiThemeProvider>
        </div>
      );
    }
    else {
      return(
        <div>
          <MuiThemeProvider theme={theme}>
            <MainAppBar/>
            <NoPage />
          </MuiThemeProvider>
        </div>
      );
    }
  }
}


export default App;
