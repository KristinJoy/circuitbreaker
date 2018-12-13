import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import GameRoom from "./GameRoom/GameRoom";
import Challenges from "./Challenges/Challenges";
import Map from "./Map/Map";
import Camera from "./Camera/Camera";
import CircuitReview from "./CircuitReview/CircuitReview";
import OpeningScreen from "./OpeningScreen/OpeningScreen";
import AppBar from "./Utilities/AppBar";
import UserProvider from "./Contexts/UserContext";
import {UserContext} from "./Contexts/UserContext";
import GameProvider from "./Contexts/GameContext";
import {GameContext} from "./Contexts/GameContext";

const App = () =>
<div>

    <AppBar />
    <OpeningScreen/>

</div>;

const AppRouter = () => (
<GameProvider>
  <Router>
    <div>
      {/*attempting to pass session id through routes:*/}
      <GameContext.Consumer>{
          (session) => (
            <div>
            <Route path="/Challenges/" id={session.user._id} component={Challenges} />
            </div>
          )
        }</GameContext.Consumer>
      <Route path="/" exact component={App} />
      <Route path="/GameRoom/" component={GameRoom} />
      <Route path="/Map/" component={Map} />
      <Route path="/Camera/" component={Camera} />
      <Route path="/CircuitReview/" component={CircuitReview} />
      <Route path="/OpeningScreen/" component={OpeningScreen} />
    </div>
  </Router>
</GameProvider>
);

export default AppRouter;
