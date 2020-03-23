import React from 'react';
import {Socket} from "phoenix-channels"

const socket_url = "ws://localhost:4000/socket"
class Title extends React.Component {
  socket = new Socket({params: {}})
  state = {date: new Date()}

  componentDidMount() {
    setTimeout(() => {
      this.setState({date: new Date()})
    }, 1000)
  }

  render() {
    return (
      <div id="chat">
          <section className="phx-hero">
              <p>Phoenix channels based chat</p>
          </section>
          <div id="messages"></div>
          <input id="chat-input" type="text"></input>
          <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
  
export default Title;
