import React from 'react';
import axios from "axios";

/*
The GameContext context is a React context object that has a
Provider component and a Consumer component
The Provider component is configured in this file - it gives anything that
is wrapped in it access to its state, which contains two important properties
When a Consumer component accesses
<GameContext.Consumer>
  {(game) => (
    //the session game object is available here
  )}
</GameContext.Consumer>
In the user game object there is placeholder data to initialize the session
(for example username is 'not logged in'). In addition, as defined in this file,
the user session object exposed by the GameContext.Consumer has methods to set
its own state with either a user's information, current circuit information, or both
retrieved by a Mongoose/MongoDB id axios put call (essentially taking the user
session cookie and synchronizing the user data on the client side with all the server data).
The important thing about this is that it updates any and all child components
of the provider when
  session.updateUser(mongodbID)
  session.updateCircuit(mongodbID)
  or
  session.updateGame(mongodbID)
is called
look at conditional rendering: https://reactjs.org/docs/conditional-rendering.html
basically, when rendering Consumers, we should check if the value exists first, then render if it does
in an inline verification. So for example, to render the 2nd challenge's full text you would
do this within a GameContext.Consumer function:
game.circuit.challenges[1] ? 'Second Challenge: '+ game.circuit.challenges[1].full_challenge_text : ''
The syntax is (condition to test) ? <span>Render if true</span> : <span>Render if not true</span>
  --> the above will make displaying information and our lives much easier
*/


export var GameContext = React.createContext();

class GameProvider extends React.Component {
  constructor(props) {
    super(props);
    //updateGame method takes a user id, and uses the /update Express route
    //to reset the GameProvider state w/ new user and current circuit data from the server
    this.updateGame = (userId) => {
      console.log("updateGame accessed w/ uid: ", userId);
      const updateRoute = process.env.REACT_APP_BACK_END_SERVER + 'update';
      //must be a put request because passing a value to be searched by
      axios.put(updateRoute, {userId}).then((res,err) => {
        console.log("get game data handled", res.data);
        if(err){console.log(err);}
        this.setState(
          {
              user: res.data.user,
              circuit: res.data.circuit
          });//closes set state
          console.log("set state of Game (user and circuit) complete, user: ", this.state.user.username);
          console.log("user's circuit id: ", this.state.circuit._id);
        });//closes .then()
    };//closes updateGame


    this.updateUser = (userId) => {
      console.log("updateUser accessed w/ uid: ", userId);
      const getUser = process.env.REACT_APP_BACK_END_SERVER + 'getUser';
      axios.put(getUser, {userId}).then((res,err) => {
        console.log("get user handled", res.data.username);
        if(err){console.log(err);}
        this.setState(
          {
              user: res.data
          });//closes set state
          console.log("set user state complete, user: ", this.state.user.username);
        });//closes .then()
    };//closes updateUser

    this.updateCircuit = (userId) => {
      console.log("updateCircuit accessed w/ uid: ", userId);
      const updateCircuit = process.env.REACT_APP_BACK_END_SERVER + 'updateCircuit';
      //must be a put request because passing a value to be searched by
      axios.put(updateCircuit, {userId}).then((res,err) => {
        console.log("updateCircuit complete, data: ", res.data)
        if(err){console.log(err);}
        this.setState(
          {
              circuit: res.data
          });//closes set state
          console.log("set state of circuit complete, circuit id: ", this.state.circuit._id);
        });//closes .then()
    };//closes updateCircuit

    //filling in the constructor with placeholders so react doesn't crash trying to render null data:
    //these placeholders are overwritten with the updateUser Server call
    this.state = {
        //this user object is the copy of what is in the server every time
        //the Provider's passed value={this.state} .updateUser(userId) method
        //is accessed
        user: {
          username: 'Not logged in',
          current_user_location: {
            type: "",
            coordinates: []
          }, //set in addUser and updateUserLocation
          user_session_boundary: {
            here_api_format: [] //only need one format of bounding box for Here API and matchmaking
          },
          challenges_completed: [], //id's of challenges completed, I don't think we need this
          circuits_participated:[]
        },
        circuit: {
            circuit_boundaries: [],
            challenges:[{
              //order challenges by distance in getChallengeList?
              object_gate: '', //word of object we want to confirm
              location_gate: {
                position: [], //array of lat/long coords
                name: '', //name of location
                address: '', //address in plain text
                category: '' //whatever category the location belongs to
              },
              id_users_completed: [], //ids of users that have completed this challenge
              full_challenge_text: ''
            }]
        },
        updateUser: this.updateUser, //make it so updateUser method is available in state
        updateGame: this.updateGame,
        updateCircuit: this.updateCircuit
    };
  }

  render() {
    //<UserProvider> component returns the <UserContext.Provider> object
    //with the value passing to anything inside of it the state contained
    //in the initial and subsequent setting of this Component's state
    return (
      <GameContext.Provider value={this.state}>
        {this.props.children}
      </GameContext.Provider>
    );
  }
}

export default GameProvider;
