import React from 'react';
import {Socket} from "phoenix-channels"
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'

const socket_url = "ws://localhost:4000/socket"
class Title extends React.Component {
  state = {
    username: '',
    messages: [
      {body:'hey man', username:'kevin'},
      {body:'uh hi', username:'joe'}, 
      {body:'did you get a job', username:'kevin'},
      {body:'yes', username:'joe'}, 
    ]
  }
  socket = new Socket(socket_url, {params: {}})
  messagesRef = React.createRef();

  componentDidMount() {
    this.socket.connect()
    this.channel = this.socket.channel("room:lobby", {})
    this.channel.join()
      .receive("ok", resp => { console.log("Joined successfully", resp) })
      .receive("error", resp => { console.log("Unable to join", resp) })

    this.channel.on("new_msg", payload => {
      this.setState({messages: this.state.messages.concat(payload)})
      this.scrollToBottom()
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

  scrollToBottom = () => {
    this.messagesRef.current.scrollIntoView({behavior: 'smooth'})
  }

  render() {
    return (
      <div className='chat-container'>
        {/* Top Bar */}
        <div className="chat-header">
         <p class='align-left'>CHAT</p>
         <input
            type="text"
            class="username-input align-right"
            placeholder={'Enter your name'}
            value={this.state.username}
            onChange={e => this.setState({ username: e.target.value })}
          />
        </div>

        {/* Messages */}
        <div className="chat-log">
          {this.state.messages.map((message, index) =>
            <ChatMessage
              key={index}
              message={message.body}
              username={message.username}
            />
          )}
          <div ref={this.messagesRef}/>
        </div>

        {/* Input Area */}
        <div className="chat-footer">
          <ChatInput onSubmitMessage={this.submitMessage} />

        </div>
      </div>
    );
  }
}
  
export default Title;
