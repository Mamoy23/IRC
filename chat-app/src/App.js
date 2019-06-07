import React from 'react';
import './App.css';
import Login from './Login';
import Home from './Home';

class App extends React.Component {
  state = {
      username: '',
  }

  handleChange = (username) => {
    this.setState({username: username});
  }

  render(){
    if(this.state.username !== '')
      return <Home username={this.state.username}/>
    else
      return <Login handleUser={this.handleChange}/>
  }
}

export default App;
