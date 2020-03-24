import React from 'react'
// import {Socket} from 'phoenix-channels'
import {Socket, Presence} from 'phoenix'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import Fingerprint2 from 'fingerprintjs2'

const socket_url = "ws://localhost:4000/socket"
class Title extends React.Component {
  state = {
    username: '',
    messages: [],
    members: []
  }
  messagesRef = React.createRef();

  componentDidMount() {
    // Generate browser canvas fingerprint
    Fingerprint2.get(components => {
      let values = components.map(function (component) { return component.value })
      let murmur = Fingerprint2.x64hash128(values.join(''), 31)
      console.log("Browser fingerprint: " + murmur)

      // Connect to elixir channels
      let socket = new Socket(socket_url, {params: {user_id: murmur}})
      socket.connect()
      this.channel = socket.channel("room:lobby", {})
      this.channel.join()
        .receive("ok", resp => {
          console.log("Joined channel successfully", resp)
          let message = {
            username: this.state.username,
            body: "Someone has joined",
            is_cmd: false,
            is_announcement: true,
          }
          this.channel.push("new_msg", message)
        })
        .receive("error", resp => { console.log("Unable to join", resp) })

      this.channel.on("new_msg", payload => {
        this.setState({messages: this.state.messages.concat(payload)})
        if (!payload.is_cmd) {
          this.scrollToBottom()
        }
      })

      this.presence = new Presence(this.channel)
      this.presence.onSync(() => {
        this.members = this.presence.list()
        console.log(this.members)
      })

      this.presence.onJoin((id, current, newPres) => {
        console.log("Presence join")
      })
    })
  }

  submitMessage = messageString => {
    let message = {
      username: this.state.username,
      body: messageString,
      is_cmd: false,
      is_announcement: false,
    }
    this.channel.push("new_msg", message)
  }

  scrollToBottom = () => {
    this.messagesRef.current.scrollIntoView({behavior: 'smooth'})
  }

  submitCommand = () => {
    let message = {
      username: this.state.username,
      body: "Play",
      is_cmd: true,
      is_announcement: false,
    }
    this.channel.push("new_msg", message)
  }

  render() {
    return (
      <div className='chat-container'>
        {/* Top Bar */}
        <div className="chat-header">
         <p className='align-left'>CHAT</p>
         <input
            type="text"
            className="username-input align-right"
            placeholder={'Enter your name'}
            value={this.state.username}
            onChange={e => this.setState({ username: e.target.value })}
          />
        <button className="submit-input align-right" onClick={this.submitCommand}>Command</button>
        </div>

        {/* Messages */}
        <div className="chat-log">
          {this.state.messages.map((message, index) =>
            <ChatMessage
              key={index}
              message={message.body}
              username={message.username}
              is_cmd={message.is_cmd}
              timestamp={message.timestamp}
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