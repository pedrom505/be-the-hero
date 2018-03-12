import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';
import history from './history'


import LandingPageComponent from './components/LandingPageComponent'
import LoginComponent from './components/LoginComponent'
import SignUpComponent from './components/SignUpComponent'
import HomeComponent from './components/HomeComponent'


class App extends Component {
  render() {
    return (
      <Router history={history}>
        <div>
          <Route exact={true} path="/" component={LandingPageComponent}></Route>
          <Route exact={true} path="/login" component={LoginComponent}></Route>
          <Route exact={true} path="/signup" component={SignUpComponent}></Route>
          <Route exact={true} path="/home" component={HomeComponent}></Route>
        </div>
      </Router>
    );
  }
}

export default App;
