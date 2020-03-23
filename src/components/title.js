import React from 'react';
import {Socket} from "phoenix-channels"
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'

const socket_url = "ws://localhost:4000/socket"
class Title extends React.Component {
  state = {
    username: '',
    messages: []
  }
  socket = new Socket(socket_url, {params: {}})

  componentDidMount() {
    this.socket.connect()
    this.channel = this.socket.channel("room:lobby", {})
    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })

    this.channel.on("new_msg", payload => {
      this.setState({messages: this.state.messages.concat(payload)})
      console.log(payload)
    })
  }

  submitMessage = messageString => {
    let message = {
      username: this.state.username,
      body: messageString,
    }
    this.channel.push("new_msg", message)
  }

  render() {
    return (
      <div id="chat">
          <section className="phx-hero">
              <p>Phoenix channels based chat</p>
          </section>
          <div id="messages"></div>
          <input
            type="text"
            id="username-input"
            placeholder={'Enter your name...'}
            value={this.state.username}
            onChange={e => this.setState({ username: e.target.value })}
          />
          <ChatInput
            onSubmitMessage={this.submitMessage}
          />
          {this.state.messages.map((message, index) =>
            <ChatMessage
              key={index}
              message={message.body}
              username={message.username}
            />,
          )}
      </div>
    );
  }
}
  
export default Title;
