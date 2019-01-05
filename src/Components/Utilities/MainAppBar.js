import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
// import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from "@material-ui/icons/Menu";
import MenuButton from "./MenuButton";
import Avatar from "./Avatar";
import {GameContext} from "../Contexts/GameContext";
// import {RouterContext} from "../Contexts/RouterContext";


function MainAppBar(props) {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
        <Typography variant="h5" color="inherit">
            Circuit Breaker
          </Typography>
          <Avatar />
        </Toolbar>
      </AppBar>
    </div>
  );
}


export default MainAppBar;
