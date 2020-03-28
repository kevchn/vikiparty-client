import React from 'react'
// import {Socket} from 'phoenix-channels'
import {Socket, Presence} from 'phoenix'
import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import Fingerprint2 from 'fingerprintjs2'

// const socket_url = "ws://localhost:4000/socket"
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

      // Connect to elixir socket
      let socket = new Socket(socket_url, {params: {user_id: murmur}})
      socket.onError(() => { this.connectionErrorCallback("server") })
      socket.onClose(() => { this.connectionCloseCallback("server") })
      socket.connect()

      // Connect to elixir channel
      this.channel = socket.channel("room:lobby", {})
      this.channel.onError(() => { this.connectionErrorCallback("room") })
      this.channel.onClose(() => { this.connectionCloseCallback("room") })
      this.channel.join().receive("ok", this.connectionSuccessCallback)

      // Setup a listener on new messages from elixir channel
      this.channel.on("new_msg", payload => {
        this.setState({messages: this.state.messages.concat(payload)})
        if (!payload.is_cmd) {
          this.scrollToBottom()
        }
      })

      this.presence = new Presence(this.channel)
      this.presence.onSync(() => {
        this.setState({members: this.presence.list()})
        console.log(this.state.members)
      })

      this.presence.onJoin((id, current, newPres) => {
        if (!current) {
          console.log("User has joined", newPres)
          if (id == murmur) {
            console.log("It's me!")
          }
          console.log(id)
        } else {
          console.log("User has joined in an additional window", newPres)
        }
      })

      this.presence.onLeave((id, current, leftPres) => {
        if (current.metas.length == 0) {
          console.log("User has left from all devices", leftPres)
        } else {
          console.log("User has left from a device", leftPres)
        }
      })
    })
  }

  submitMessage = messageString => {
    let message = {
      body: messageString,
    }
    this.channel.push("new_msg", message)
  }

  scrollToBottom = () => {
    this.messagesRef.current.scrollIntoView({behavior: 'smooth'})
  }

  submitCommand = () => {
    let message = {
      body: "Play",
    }
    this.channel.push("new_msg", message)
  }

  connectionSuccessCallback = () => {
    let message = {
      body: "You have connected to the room as " + this.state.username + '.',
      is_local: true
    }
    this.setState({messages: this.state.messages.concat(message)})
  }

  connectionErrorCallback = obj => {
    let message = {
      body: "Could not connect to the " + obj + ". Retrying.",
      is_local: true
    }
    this.setState({messages: this.state.messages.concat(message)})
  }

  connectionCloseCallback = obj => {
    let message = {
      body: "Disconnected from the " + obj + ".",
      is_local: true
    }
    this.setState({messages: this.state.messages.concat(message)})
  }



  render() {
    return (
      <div className='chat-container'>
        {/* Top Bar */}
        <div>
          {this.state.members.map((item, index) => (
            <li key={index}>{item.metas[0]['username']}</li>
          ))}
        </div>
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
              is_local={message.is_local}
              is_announcement={message.is_announcement}
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